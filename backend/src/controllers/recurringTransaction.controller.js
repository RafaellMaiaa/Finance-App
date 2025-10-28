import RecurringTransaction from '../models/recurringTransaction.model.js';
import Transaction from '../models/transaction.model.js';
import { sendEmail } from '../services/email.js'; 

// Obter todos os modelos de transações recorrentes do utilizador
export const getRecurringTransactions = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Utilizador não autenticado.' });
    }
    const recurring = await RecurringTransaction.find({ user: req.user._id }).sort('description');
    res.status(200).json(recurring);
  } catch (error) {
    console.error("Erro ao obter transações recorrentes:", error);
    res.status(500).json({ error: 'Erro interno ao obter transações recorrentes.' });
  }
};

// Criar um novo modelo
export const createRecurringTransaction = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Utilizador não autenticado.' });
    }
    const { description, amount, type, category, dayOfMonth } = req.body;

    // Validação básica dos dados recebidos
    if (!description || amount == null || !type || !category || !dayOfMonth) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    if (dayOfMonth < 1 || dayOfMonth > 31) {
        return res.status(400).json({ error: 'Dia do mês inválido (deve ser entre 1 e 31).' });
    }

    const recurring = await RecurringTransaction.create({
      user: req.user._id,
      description,
      amount: parseFloat(amount), // Garante que é um número
      type,
      category,
      dayOfMonth: parseInt(dayOfMonth), // Garante que é um número
    });
    res.status(201).json(recurring);
  } catch (error) {
    console.error("Erro ao criar transação recorrente:", error);
    // Verifica se o erro é de chave duplicada (categoria + user + data)
     if (error.code === 11000) {
        return res.status(400).json({ error: 'Já existe um modelo recorrente com esta descrição para este utilizador.' });
     }
    res.status(400).json({ error: 'Erro ao criar transação recorrente.' });
  }
};

// Apagar um modelo
export const deleteRecurringTransaction = async (req, res) => {
  try {
     if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Utilizador não autenticado.' });
    }
    const { id } = req.params;
    const recurring = await RecurringTransaction.findOneAndDelete({ _id: id, user: req.user._id });
    if (!recurring) {
      return res.status(404).json({ error: 'Modelo não encontrado ou não tem permissão para o apagar.' });
    }
    res.status(200).json({ message: 'Modelo de transação recorrente apagado.' });
  } catch (error) {
    console.error("Erro ao apagar transação recorrente:", error);
    res.status(500).json({ error: 'Erro interno ao apagar o modelo.' });
  }
};

// Função para verificar e enviar lembretes
export const checkAndNotifyRecurring = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Utilizador não autenticado.' });
    }

    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentPeriod = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const daysBeforeNotify = 5; // Configuração: quantos dias antes enviar o aviso

    const templates = await RecurringTransaction.find({ user: req.user._id });

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);
    const monthlyTransactions = await Transaction.find({ 
      user: req.user._id, 
      date: { $gte: startOfMonth, $lte: endOfMonth } 
    });

    let notificationsSent = 0;
    const errorsSending = [];

    for (const template of templates) {
      const dueDate = template.dayOfMonth;
      // Calcula os dias restantes (considerando fim do mês, se dueDate > dias no mês)
      // Esta lógica pode ser melhorada para lidar com meses de diferentes durações
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
      const effectiveDueDate = Math.min(dueDate, daysInMonth); 
      const daysUntilDue = effectiveDueDate - currentDay;

      // Verifica se está na janela de aviso E se ainda não avisámos este mês
      if (daysUntilDue >= 0 && daysUntilDue <= daysBeforeNotify && template.lastNotifiedPeriod !== currentPeriod) {
        
        // Verifica se já existe uma transação real correspondente este mês
        const alreadyExists = monthlyTransactions.some(
          t => t.description.toLowerCase() === template.description.toLowerCase() &&
               new Date(t.date).getDate() === effectiveDueDate 
        );

        // Se está na janela de aviso, não avisámos, e AINDA NÃO EXISTE, envia o email
        if (!alreadyExists) {
          // Correção: não usar funções de frontend (formatCurrency) no backend
          const emailSubject = `Lembrete Finance Flow: ${template.description}`;
          const emailHtml = `
            <p>Olá ${req.user.name},</p>
            <p>Este é um lembrete de que a sua ${template.type === 'gasto' ? 'despesa' : 'receita'} recorrente "<strong>${template.description}</strong>" no valor de <strong>${Math.abs(template.amount).toFixed(2)}€</strong> está agendada para o dia ${dueDate} deste mês.</p>
            <p>Parece que ainda não a registou na aplicação.</p>
            <p>Pode aceder à aplicação <a href="${process.env.FRONTEND_URL}">aqui</a>.</p>
            <p>Mantenha as suas finanças em dia!</p>
            <p>Atenciosamente,<br/>A equipa Finance Flow</p>
          `;

          try {
            await sendEmail({
              email: req.user.email,
              subject: emailSubject,
              html: emailHtml,
            });

            template.lastNotifiedPeriod = currentPeriod;
            await template.save();
            notificationsSent++;

          } catch (emailError) {
             console.error(`Falha ao enviar lembrete para ${template.description}:`, emailError);
             errorsSending.push(template.description);
          }
        } else {
            console.log(`Lembrete para "${template.description}" não enviado porque a transação já existe este mês.`);
        }
      }
    }

    let message = `${notificationsSent} lembretes enviados com sucesso.`;
    if (errorsSending.length > 0) {
        message += ` Falha ao enviar ${errorsSending.length} lembretes (${errorsSending.join(', ')}). Verifique os logs do servidor.`;
    }

    res.status(200).json({ message });

  } catch (error) {
    console.error("Erro geral ao verificar/notificar recorrentes:", error);
    res.status(500).json({ error: 'Erro interno ao processar lembretes recorrentes.' });
  }
};
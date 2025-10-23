import RecurringTransaction from '../models/recurringTransaction.model.js';
import Transaction from '../models/transaction.model.js';
import { sendEmail } from '../services/email.js'; // ✅ Importar a nova função 'sendEmail' em vez de 'sendLoginEmail'

// Obter todos os modelos de transações recorrentes do utilizador
export const getRecurringTransactions = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.find({ user: req.user._id });
    res.status(200).json(recurring);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter transações recorrentes.' });
  }
};

// Criar um novo modelo
export const createRecurringTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, dayOfMonth } = req.body;
    const recurring = await RecurringTransaction.create({
      user: req.user._id,
      description,
      amount,
      type,
      category,
      dayOfMonth,
    });
    res.status(201).json(recurring);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar transação recorrente.' });
  }
};

// Apagar um modelo
export const deleteRecurringTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const recurring = await RecurringTransaction.findOneAndDelete({ _id: id, user: req.user._id });
    if (!recurring) {
      return res.status(404).json({ error: 'Modelo não encontrado.' });
    }
    res.status(200).json({ message: 'Modelo de transação recorrente apagado.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar o modelo.' });
  }
};


// Função para verificar e enviar lembretes
export const checkAndNotifyRecurring = async (req, res) => {
  try {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentPeriod = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const daysBeforeNotify = 5;

    const templates = await RecurringTransaction.find({ user: req.user._id });

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);
    const monthlyTransactions = await Transaction.find({ 
      user: req.user._id, 
      date: { $gte: startOfMonth, $lte: endOfMonth } 
    });

    let notificationsSent = 0;

    for (const template of templates) {
      const dueDate = template.dayOfMonth;
      const daysUntilDue = dueDate - currentDay;

      if (daysUntilDue > 0 && daysUntilDue <= daysBeforeNotify && template.lastNotifiedPeriod !== currentPeriod) {
        
        const alreadyExists = monthlyTransactions.some(
          t => t.description.toLowerCase() === template.description.toLowerCase() &&
               new Date(t.date).getDate() === dueDate
        );

        if (!alreadyExists) {
          const emailSubject = `Lembrete Finance Flow: ${template.description}`;
          const emailHtml = `
            <p>Olá ${req.user.name},</p>
            <p>Este é um lembrete amigável de que a sua ${template.type === 'gasto' ? 'despesa' : 'receita'} recorrente "${template.description}" no valor de ${Math.abs(template.amount)}€ está agendada para o dia ${dueDate} deste mês.</p>
            <p>Parece que ainda não a registou na aplicação.</p>
            <p>Mantenha as suas finanças em dia!</p>
            <p>Atenciosamente,<br/>A equipa Finance Flow</p>
          `;

          await sendEmail({ 
            email: req.user.email,
            subject: emailSubject,
            html: emailHtml,
            url: `${process.env.FRONTEND_URL}`
          });

          template.lastNotifiedPeriod = currentPeriod;
          await template.save();
          notificationsSent++;
        }
      }
    }

    res.status(200).json({ message: `${notificationsSent} lembretes enviados.` });

  } catch (error) {
    console.error("Erro ao verificar/notificar recorrentes:", error);
    res.status(500).json({ error: 'Erro ao processar lembretes recorrentes.' });
  }
};
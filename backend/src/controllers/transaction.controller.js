import Transaction from '../models/transaction.model.js';
import RecurringTransaction from '../models/recurringTransaction.model.js'; // Importar o novo modelo

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter as transações.' });
  }
};

export const addTransaction = async (req, res) => {
  try {
    // 1. Extraímos 'notes' do pedido
    const { description, amount, type, category, notes } = req.body;
    const finalAmount = type === 'gasto' ? -Math.abs(amount) : Math.abs(amount);

    const newTransaction = new Transaction({
      description,
      amount: finalAmount,
      type,
      category,
      user: req.user._id,
      notes, // 2. Adicionamos as notas ao novo objeto de transação
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("Erro ao adicionar transação:", error); 
    res.status(400).json({ error: 'Erro ao adicionar a transação.' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndDelete({ _id: id, user: req.user._id });
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada ou não tem permissão.' });
    }
    res.status(200).json({ message: 'Transação apagada com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar a transação.' });
  }
};

// ✅ NOVA FUNÇÃO "MÁGICA" ✅
export const generateRecurringTransactions = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentPeriod = `${currentYear}-${currentMonth}`;

    // 1. Vai buscar todos os modelos do utilizador
    const templates = await RecurringTransaction.find({ user: req.user._id });

    const generatedTransactions = [];

    // 2. Itera sobre cada modelo
    for (const template of templates) {
      // 3. Verifica se já gerámos uma transação para este modelo neste mês
      if (template.lastGenerated !== currentPeriod) {
        // 4. Se não, cria a nova transação
        const finalAmount = template.type === 'gasto' ? -Math.abs(template.amount) : Math.abs(template.amount);

        // Garante dia válido dentro do mês
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const day = Math.min(Math.max(Number(template.dayOfMonth) || 1, 1), daysInMonth);

        const newTransaction = await Transaction.create({
          user: req.user._id,
          description: template.description,
          amount: finalAmount,
          type: template.type,
          category: template.category,
          date: new Date(currentYear, currentMonth - 1, day),
          notes: template.notes || '',
        });

        generatedTransactions.push(newTransaction);

        // 5. Atualiza o modelo para sabermos que já foi gerado este mês
        template.lastGenerated = currentPeriod;
        await template.save();
      }
    }

    res.status(201).json({ 
      message: `${generatedTransactions.length} transações recorrentes foram geradas.`,
      generated: generatedTransactions 
    });
  } catch (error) {
    console.error('Erro ao gerar transações recorrentes:', error);
    res.status(500).json({ error: 'Erro ao gerar transações recorrentes.' });
  }
};
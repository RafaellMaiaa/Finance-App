import RecurringTransaction from '../models/recurringTransaction.model.js';

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
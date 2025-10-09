import Transaction from '../models/transaction.model.js';

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
    const { description, amount, type, category } = req.body;
    const finalAmount = type === 'gasto' ? -Math.abs(amount) : Math.abs(amount);

    const newTransaction = new Transaction({
      description,
      amount: finalAmount,
      type,
      category,
      user: req.user._id,
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
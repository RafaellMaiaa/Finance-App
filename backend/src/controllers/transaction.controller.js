import Transaction from '../models/transaction.model.js';

export const getTransactions = async (req, res) => {
  // ✅ CÂMARA DE VIGILÂNCIA 1: Vemos quem está a PEDIR a lista.
  console.log('--- GET TRANSACTIONS --- Utilizador que está a pedir:', req.user);
  
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter as transações.' });
  }
};

export const addTransaction = async (req, res) => {
  // ✅ CÂMARA DE VIGILÂNCIA 2: Vemos quem está a GUARDAR a transação.
  console.log('--- ADD TRANSACTION --- Utilizador que está a guardar:', req.user);

  try {
    const { description, amount, type, category } = req.body;
    const finalAmount = type === 'gasto' ? -Math.abs(amount) : Math.abs(amount);

    const newTransaction = new Transaction({
      description,
      amount: finalAmount,
      type,
      category,
      user: req.user.id,
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("Erro ao adicionar transação:", error); 
    res.status(400).json({ error: 'Erro ao adicionar a transação. Verifique os dados enviados.' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndDelete({ _id: id, user: req.user.id });
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada ou não tem permissão.' });
    }
    res.status(200).json({ message: 'Transação apagada com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar a transação.' });
  }
};
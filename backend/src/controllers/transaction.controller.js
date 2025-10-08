// =================================================================
// CÓDIGO COMPLETO PARA: backend/src/controllers/transaction.controller.js
// =================================================================

import Transaction from '../models/transaction.model.js';

// Obter todas as transações
// ✅ A palavra 'export' é crucial aqui
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 }); // Mais recentes primeiro
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter as transações.' });
  }
};

// Adicionar uma nova transação
// ✅ A palavra 'export' é crucial aqui
export const addTransaction = async (req, res) => {
  try {
    const { description, amount, type, category } = req.body;

    // Converte o montante para negativo se for um gasto
    const finalAmount = type === 'gasto' ? -Math.abs(amount) : Math.abs(amount);

    const newTransaction = new Transaction({
      description,
      amount: finalAmount,
      type,
      category,
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    // Adiciona um log do erro no terminal do backend para ajudar a depurar
    console.error("Erro ao adicionar transação:", error); 
    res.status(400).json({ error: 'Erro ao adicionar a transação. Verifique os dados enviados.' });
  }
};

// Apagar uma transação
// ✅ A palavra 'export' é crucial aqui
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada.' });
    }
    res.status(200).json({ message: 'Transação apagada com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar a transação.' });
  }
};
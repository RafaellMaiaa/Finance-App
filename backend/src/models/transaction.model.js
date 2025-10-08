// =================================================================
// CÓDIGO COMPLETO PARA: backend/src/models/transaction.model.js
// =================================================================

import mongoose from 'mongoose';

// Este é o Schema, a estrutura dos seus dados
const transactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true, // Obrigatório ter uma descrição
    trim: true,     // Remove espaços em branco no início e no fim
  },
  amount: {
    type: Number,
    required: true, // Obrigatório ter um montante
  },
  type: {
    type: String,
    required: true,
    enum: ['ganho', 'gasto'], // O tipo só pode ser 'ganho' ou 'gasto'
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now, // Se não for especificada, a data é a de agora
  },
});

// A partir do Schema, criamos o Model, que é o que nos permite
// interagir com a coleção de 'transactions' na base de dados.
const Transaction = mongoose.model('Transaction', transactionSchema);

// Exportamos o Model para que outros ficheiros (como o controller) o possam usar.
export default Transaction;
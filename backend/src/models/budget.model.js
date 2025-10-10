import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String, // Vamos usar o nome da categoria diretamente
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'O valor do orçamento não pode ser negativo'],
  },
  month: { // Ex: 1 para Janeiro, 12 para Dezembro
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: { // Ex: 2025
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Garante que um utilizador só pode ter um orçamento por categoria por mês/ano
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
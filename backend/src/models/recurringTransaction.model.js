import mongoose from 'mongoose';

const recurringTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['ganho', 'gasto'],
  },
  category: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
    enum: ['monthly'], // Por agora, só suportamos mensal
    default: 'monthly',
  },
  dayOfMonth: {
    type: Number,
    required: true, // Dia do mês em que a transação ocorre
    min: 1,
    max: 31,
  },
  lastGenerated: { // Para sabermos qual o último mês/ano gerado
    type: String, // Formato "YYYY-MM"
  },
}, {
  timestamps: true,
});

const RecurringTransaction = mongoose.model('RecurringTransaction', recurringTransactionSchema);

export default RecurringTransaction;
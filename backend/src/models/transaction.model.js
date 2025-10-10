import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true, enum: ['ganho', 'gasto'] },
  category: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // ✅ NOVO CAMPO ADICIONADO AQUI ✅
  notes: {
    type: String,
    trim: true,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
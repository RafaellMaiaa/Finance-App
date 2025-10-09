import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true, enum: ['ganho', 'gasto'] },
  category: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// ✅✅✅ O NOSSO "ESPIÃO" ✅✅✅
transactionSchema.pre('save', function(next) {
  console.log('\n--- MONGOOSE PRE-SAVE HOOK ---');
  console.log('Documento prestes a ser guardado:', this);
  if (!this.user) {
    console.error('ALERTA DO PRE-SAVE: O campo "user" está em falta ANTES de guardar!');
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
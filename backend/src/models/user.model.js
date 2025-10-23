import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  
  // ✅ NOVO CAMPO PARA A MOEDA PREFERIDA ✅
  preferredCurrency: {
    type: String,
    required: true,
    enum: ['EUR', 'USD', 'GBP', 'BRL'], // Moedas suportadas
    default: 'EUR', // Moeda padrão para novos utilizadores
  },
}, {
  timestamps: true 
});

const User = mongoose.model('User', userSchema);
export default User;
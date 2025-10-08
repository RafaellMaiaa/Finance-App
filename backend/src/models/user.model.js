import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  googleId: { // Campo para guardar o ID do Google
    type: String,
    unique: true,
    sparse: true, // Permite valores nulos e garante que os preenchidos são únicos
  }
}, {
  timestamps: true // Adiciona automaticamente os campos createdAt e updatedAt
});

const User = mongoose.model('User', userSchema);
export default User;
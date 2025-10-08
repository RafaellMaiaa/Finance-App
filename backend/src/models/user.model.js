import mongoose from 'mongoose';
import crypto from 'crypto'; // Módulo nativo do Node.js

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  // Já não precisamos do campo 'password'
  loginToken: String,
  loginTokenExpires: Date,
});

// Método para criar o token de login
userSchema.methods.createLoginToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  // Guardamos uma versão encriptada na base de dados por segurança
  this.loginToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // O token expira em 10 minutos
  this.loginTokenExpires = Date.now() + 10 * 60 * 1000;

  // Devolvemos o token não encriptado para ser enviado por email
  return token;
};

const User = mongoose.model('User', userSchema);
export default User;
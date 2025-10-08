import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport'; // Importar o passport
import './config/passport.js'; // Importar e executar a nossa configuração do passport
import aiRoutes from './routes/ai.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js'; 
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize()); // Iniciar o passport

// Rota Principal para Teste
app.get('/', (req, res) => {
  res.send('<h1>A API está a funcionar e conectada à base de dados!</h1>');
});

// Rotas da API
app.use('/api', authRoutes);
app.use('/api', userRoutes); // ✅ Adicionar esta linha
app.use('/api', aiRoutes);
app.use('/api', transactionRoutes);
// Conectar à Base de Dados MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado com sucesso ao MongoDB!');
    app.listen(PORT, () => {
      console.log(`Servidor a correr na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro fatal ao conectar ao MongoDB:', err);
  });
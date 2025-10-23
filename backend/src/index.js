import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import './config/passport.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import recurringTransactionRoutes from './routes/recurringTransaction.routes.js'; // ✅ Adicionado
import aiRoutes from './routes/ai.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('<h1>API a funcionar e conectada à base de dados!</h1>');
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', budgetRoutes);
app.use('/api', recurringTransactionRoutes); // ✅ Adicionado
app.use('/api', aiRoutes);
app.use('/api', transactionRoutes);

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
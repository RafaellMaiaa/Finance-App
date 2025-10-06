import express from 'express';
import cors from 'cors';
import transactionsRoutes from './routes/transactions.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/transactions', transactionsRoutes);

// Teste rápido
app.get('/', (req, res) => {
  res.send('🚀 API Financeira Online');
});

export default app;

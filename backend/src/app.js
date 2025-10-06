import express from 'express';
import cors from 'cors';
import transactionsRoutes from './routes/transaction.routes.js';
import aiRoutes from './routes/ai.routes.js'; // Note a extensão .js no final
app.use('/api', aiRoutes);

app.use('/api', aiRoutes); // O prefixo /api é opcional mas é uma boa prática
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

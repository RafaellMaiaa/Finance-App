// =================================================================
// CÓDIGO COMPLETO PARA: backend/src/index.js
// =================================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import aiRoutes from './routes/ai.routes.js';
import transactionRoutes from './routes/transaction.routes.js'; // A linha que faltava está aqui

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares (Configurações Iniciais)
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api', aiRoutes);
app.use('/api', transactionRoutes);

console.log('--- As rotas de transações foram carregadas com sucesso! ---');
app.get('/', (req, res) => {
  res.send('<h1>A API está a funcionar e conectada à base de dados!</h1>');
});
// Conectar à Base de Dados MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado com sucesso ao MongoDB!');
    
    // Iniciar o servidor Express SÓ DEPOIS da conexão ser bem-sucedida
    app.listen(PORT, () => {
      console.log(`Servidor a correr na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro fatal ao conectar ao MongoDB:', err);
  });
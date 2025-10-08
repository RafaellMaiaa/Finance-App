// =================================================================
// CÓDIGO COMPLETO PARA: backend/src/controllers/ai.controller.js
// =================================================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import Transaction from '../models/transaction.model.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askAi = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "A pergunta é obrigatória." });
    }
    
    // PASSO 1 DE DEBUG: Ir buscar os dados financeiros à base de dados
    const financialData = await Transaction.find().sort({ date: -1 }).limit(50);

    // ✅ PASSO 2 DE DEBUG: A "CÂMARA DE VIGILÂNCIA"
    // Vamos ver no terminal do backend o que foi encontrado na base de dados.
    console.log('--- Dados Financeiros Encontrados na BD ---');
    console.log(financialData);
    console.log('-------------------------------------------');

    // Validação extra: Se não houver dados, informamos a IA.
    if (!financialData || financialData.length === 0) {
      const answer = "Não encontrei quaisquer dados financeiros na base de dados para analisar. Por favor, adicione primeiro as suas transações.";
      return res.status(200).json({ answer });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Baseado nos seguintes dados financeiros do utilizador (em formato JSON):
      ${JSON.stringify(financialData, null, 2)}

      Responda à seguinte pergunta do utilizador de forma clara e direta: "${question}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ answer: text });
  } catch (error) {
    console.error("Erro ao comunicar com a API do Gemini ou DB:", error); // <-- A PISTA ESTÁ AQUI
    res.status(500).json({ error: "Ocorreu um erro ao processar o seu pedido." });
}
};

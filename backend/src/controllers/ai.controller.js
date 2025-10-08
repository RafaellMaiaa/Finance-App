import { GoogleGenerativeAI } from "@google/generative-ai";
import Transaction from '../models/transaction.model.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askAi = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "A pergunta é obrigatória." });
    }
    
    // ✅ GARANTA QUE ESTA LINHA FILTRA PELO ID DO UTILIZADOR
    const financialData = await Transaction.find({ user: req.user.id }).sort({ date: -1 }).limit(50);

    // ... (resto do ficheiro permanece igual)

    if (!financialData || financialData.length === 0) {
      const answer = "Não encontrei quaisquer dados financeiros na sua conta para analisar. Por favor, adicione primeiro as suas transações.";
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
    console.error("Erro ao comunicar com a API do Gemini ou DB:", error);
    res.status(500).json({ error: "Ocorreu um erro ao processar o seu pedido." });
  }
};
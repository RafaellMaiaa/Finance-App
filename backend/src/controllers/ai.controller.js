import { GoogleGenerativeAI } from "@google/generative-ai";
import Transaction from '../models/transaction.model.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askAi = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "A pergunta é obrigatória." });
    }

    // ✅✅✅ A NOSSA NOVA "REGRA ESPECIAL" COMEÇA AQUI ✅✅✅

    // Convertemos a pergunta para minúsculas para a verificação ser mais fiável
    const lowerCaseQuestion = question.toLowerCase();

    // Verificamos se a pergunta contém palavras-chave sobre o criador
    if (
      lowerCaseQuestion.includes('quem te criou') ||
      lowerCaseQuestion.includes('quem te fez') ||
      lowerCaseQuestion.includes('quem é o criador') ||
      lowerCaseQuestion.includes('quem te desenvolveu') ||
      lowerCaseQuestion.includes('criador do site') ||
      lowerCaseQuestion.includes('criador da app')
    ) {
      // Se for uma pergunta sobre o criador, respondemos diretamente
      const creatorResponse = "Fui criado pelo Rafael Maia. Ele é o desenvolvedor por trás desta aplicação.";
      
      // Enviamos a resposta e terminamos a função aqui, sem ir ao Gemini
      return res.status(200).json({ answer: creatorResponse });
    }

    // ✅✅✅ FIM DA "REGRA ESPECIAL" ✅✅✅
     if (
      // ... (condições iguais)
      lowerCaseQuestion.includes('criador do site') ||
      lowerCaseQuestion.includes('criador da app')
    ) {
      // ✅ Resposta Atualizada
      const creatorResponse = "Fui criado pelo Rafael Maia como parte da aplicação Finance Flow.";
      return res.status(200).json({ answer: creatorResponse });
    }
    // Se a pergunta não for sobre o criador, o código continua como antes...

    const financialData = await Transaction.find({ user: req.user._id }).sort({ date: -1 }).limit(50);

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
import { GoogleGenerativeAI } from "@google/generative-ai";
import Transaction from '../models/transaction.model.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askAi = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "A pergunta é obrigatória." });
    }

    const lowerCaseQuestion = question.toLowerCase();

    // Resposta sobre o criador, agora com mais personalidade
    if (
      lowerCaseQuestion.includes('quem te criou') ||
      lowerCaseQuestion.includes('quem te fez') ||
      lowerCaseQuestion.includes('quem é o criador') ||
      lowerCaseQuestion.includes('quem te desenvolveu')
    ) {
      const creatorResponse = "Eu sou o Flow, um assistente financeiro criado com muito carinho pelo Rafael Maia! O meu propósito é ajudá-lo a navegar pelo mundo das suas finanças. 🌊";
      return res.status(200).json({ answer: creatorResponse });
    }
    
    const financialData = await Transaction.find({ user: req.user._id }).sort({ date: -1 }).limit(100);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ✅✅✅ NOVO PROMPT COM PERSONALIDADE E INSTRUÇÕES ✅✅✅
    const prompt = `
      Você é o 'Flow', um assistente financeiro amigável, positivo e encorajador para o utilizador chamado ${req.user.name}.
      A sua missão é ajudá-lo a entender as suas finanças de forma clara e simples.

      REGRAS:
      1. Use sempre um tom amigável e use emojis ocasionais para tornar a conversa mais leve (ex: 💸, 📈, 🤔, ✅).
      2. Formate as suas respostas usando Markdown para facilitar a leitura. Use **negrito** para valores importantes e listas com * para resumos.
      3. Nunca dê conselhos financeiros como um profissional, mas pode dar sugestões gerais com base nos dados.
      4. Fale sempre em Português de Portugal.

      CENÁRIOS:
      - Se a lista de dados financeiros estiver vazia, não diga que os dados são 'undefined' ou 'vazios'. Em vez disso, responda de forma encorajadora, por exemplo: "Olá ${req.user.name}! 👋 Parece que ainda não adicionou nenhuma transação. Assim que adicionar os seus primeiros ganhos e gastos, eu poderei ajudá-lo a analisá-los! Vamos a isso? 💪"
      - Se a pergunta não estiver relacionada com finanças, responda educadamente que o seu foco é apenas ajudar com questões financeiras.

      DADOS FINANCEIROS DO UTILIZADOR (em formato JSON):
      ${JSON.stringify(financialData, null, 2)}

      PERGUNTA DO UTILIZADOR:
      "${question}"
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
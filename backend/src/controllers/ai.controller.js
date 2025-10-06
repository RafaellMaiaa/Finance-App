import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa o cliente do Gemini com a chave da API guardada no ficheiro .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Função assíncrona para lidar com os pedidos
export const askAi = async (req, res) => {
  try {
    // Extrai a pergunta e os dados financeiros do corpo (body) do pedido
    const { question, financialData } = req.body;

    // Validação: verifica se a pergunta foi enviada
    if (!question) {
      return res.status(400).json({ error: "A pergunta é obrigatória." });
    }

    // Seleciona o modelo de IA a ser usado
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Cria o prompt (instrução) para a IA, combinando os dados e a pergunta
    const prompt = `
      Baseado nos seguintes dados financeiros:
      ${JSON.stringify(financialData, null, 2)}

      Responda à seguinte pergunta do utilizador de forma clara e direta: "${question}"
    `;

    // Envia o prompt para o modelo e aguarda a geração de conteúdo
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Envia a resposta da IA de volta para o frontend
    res.status(200).json({ answer: text });

  } catch (error) {
    console.error("Erro ao comunicar com a API do Gemini:", error);
    res.status(500).json({ error: "Ocorreu um erro ao processar o seu pedido." });
  }
};

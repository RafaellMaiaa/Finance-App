// frontend/src/Chat.js
import React, { useState } from 'react';
import axios from 'axios';

// URL base da sua API. Certifique-se que a porta está correta!
const API_URL = 'http://localhost:3001/api/ask-ai';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      // Dados financeiros de exemplo (no futuro, virão do estado da sua app)
      const exampleFinancialData = [
        { "description": "Salário Mensal", "amount": 2500, "category": "Receita" },
        { "description": "Renda de casa", "amount": -800, "category": "Habitação" },
        { "description": "Supermercado", "amount": -350, "category": "Comida" }
      ];

      // Fazendo o pedido POST para o backend com axios
      const response = await axios.post(API_URL, {
        question: input,
        financialData: exampleFinancialData
      });

      const aiMessage = { sender: 'ai', text: response.data.answer };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error('Erro ao conectar com o servidor:', err);
      setError('❌ Desculpe, não foi possível obter uma resposta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {isLoading && <p>A pensar...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte algo sobre as suas finanças..."
        />
        <button type="submit" disabled={isLoading}>Enviar</button>
      </form>
    </div>
  );
}

export default Chat;
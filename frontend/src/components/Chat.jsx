import React, { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    
    const userMsg = { from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ask-ai', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { from: 'ai', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { from: 'ai', text: '❌ Erro ao conectar com o servidor.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !loading) send();
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8, backgroundColor: 'white' }}>
      <h3>🤖 Assistente de Finanças</h3>
      <div style={{ 
        minHeight: 200, 
        maxHeight: 300, 
        overflowY: 'auto', 
        border: '1px solid #ddd', 
        padding: 10, 
        marginBottom: 10,
        backgroundColor: '#fafafa'
      }}>
        {messages.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
            Pergunta sobre poupanças, orçamentos, investimentos...
          </p>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{ 
              marginBottom: 10, 
              padding: 8,
              backgroundColor: m.from === 'user' ? '#e3f2fd' : '#f3e5f5',
              borderRadius: 8
            }}>
              <strong>{m.from === 'user' ? '👤 Tu: ' : '🤖 IA: '}</strong> 
              {m.text}
            </div>
          ))
        )}
        {loading && <div style={{ fontStyle: 'italic', color: '#666' }}>⏳ IA a pensar...</div>}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ex: Como poupar 100€ por mês?" 
          style={{ flex: 1, padding: 10 }}
          disabled={loading}
        />
        <button onClick={send} disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
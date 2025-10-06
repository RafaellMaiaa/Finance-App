import React, { useState } from 'react';

export default function AddTransaction({ onAdd }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Alimentação');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [description, setDescription] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { 
      amount: parseFloat(amount), 
      type, 
      category, 
      date, 
      description 
    };
    
    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      onAdd(data);
      setAmount(''); 
      setDescription('');
    } catch (error) {
      alert('Erro ao adicionar transação');
    }
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8, marginBottom: 20, backgroundColor: 'white' }}>
      <h3>➕ Adicionar Transação</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input 
            required 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            placeholder="Valor (ex: 50.00)" 
            type="number"
            step="0.01"
            style={{ flex: 1 }}
          />
          <select value={type} onChange={e => setType(e.target.value)} style={{ flex: 1 }}>
            <option value="expense">💰 Despesa</option>
            <option value="income">💵 Ganho</option>
          </select>
          <input 
            value={category} 
            onChange={e => setCategory(e.target.value)} 
            placeholder="Categoria" 
            style={{ flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            style={{ flex: 1 }}
          />
          <input 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Descrição" 
            style={{ flex: 2 }}
          />
          <button type="submit" style={{ flex: 1 }}>Adicionar</button>
        </div>
      </form>
    </div>
  );
}
import React from 'react';

export default function TransactionList({ transactions }) {
  const balance = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);

  return (
    <div style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8, marginBottom: 20, backgroundColor: 'white' }}>
      <h3>
        📊 Resumo - Saldo: 
        <span style={{ color: balance >= 0 ? 'green' : 'red', marginLeft: 10 }}>
          {balance.toFixed(2)}€
        </span>
      </h3>
      
      {transactions.length === 0 ? (
        <p style={{ color: '#666' }}>Nenhuma transação registada.</p>
      ) : (
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {transactions.map(tx => (
            <div 
              key={tx.id} 
              style={{ 
                padding: 10, 
                margin: '5px 0', 
                border: '1px solid #eee',
                borderRadius: 4,
                backgroundColor: tx.type === 'income' ? '#f8fff8' : '#fff8f8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong>{tx.date}</strong> - {tx.category}
                <br />
                <small style={{ color: '#666' }}>{tx.description}</small>
              </div>
              <span style={{ 
                color: tx.type === 'income' ? 'green' : 'red', 
                fontWeight: 'bold',
                fontSize: '1.1em'
              }}>
                {tx.type === 'income' ? '+' : '-'}{tx.amount}€
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
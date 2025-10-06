import React, { useEffect, useState } from 'react';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import Chat from './components/Chat';

export default function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/transactions')
      .then(res => res.json())
      .then(setTransactions)
      .catch(err => console.error('Erro ao carregar transações:', err));
  }, []);

  const handleAdd = (tx) => {
    setTransactions(prev => [tx, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            💰 Finanças Pessoais
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Controle total das suas finanças com IA inteligente
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Transactions */}
          <div className="xl:col-span-2 space-y-8">
            <AddTransaction onAdd={handleAdd} />
            <TransactionList transactions={transactions} />
          </div>

          {/* Right Column - AI Chat */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                📊 Resumo Rápido
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-800 font-medium">Receitas</span>
                  <span className="text-green-600 font-bold">
                    {transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}€
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-800 font-medium">Despesas</span>
                  <span className="text-red-600 font-bold">
                    {transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}€
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-800 font-medium">Saldo</span>
                  <span className={`font-bold ${
                    transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0) >= 0 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0).toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
            
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}
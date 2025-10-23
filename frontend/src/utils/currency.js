// Taxas de câmbio aproximadas, usando EUR como base.
// Numa aplicação real, isto viria de uma API de cotações.
const EXCHANGE_RATES = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
  BRL: 5.5,
};

const CURRENCY_SYMBOLS = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  BRL: 'R$',
};

/**
 * Formata um valor monetário para a moeda de destino.
 * @param {number} amount - O valor, sempre em EUR (a nossa moeda base na BD).
 * @param {string} currency - A moeda de destino (ex: "USD").
 * @returns {string} - O valor formatado (ex: "$ 108,00").
 */
export const formatCurrency = (amount, currency = 'EUR') => {
  const rate = EXCHANGE_RATES[currency] || 1;
  const symbol = CURRENCY_SYMBOLS[currency] || '€';
  const convertedAmount = amount * rate;
  
  return `${symbol} ${convertedAmount.toFixed(2).replace('.', ',')}`;
};
// Taxas de câmbio aproximadas, usando EUR como base.
const EXCHANGE_RATES = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
  BRL: 5.5,
};

export const CURRENCY_SYMBOLS = { // Exportamos para usar no formulário
  EUR: '€',
  USD: '$',
  GBP: '£',
  BRL: 'R$',
};

/**
 * Formata um valor monetário (em EUR) para a moeda de destino.
 */
export const formatCurrency = (amount, currency = 'EUR') => {
  const rate = EXCHANGE_RATES[currency] || 1;
  const symbol = CURRENCY_SYMBOLS[currency] || '€';
  const convertedAmount = amount * rate;
  
  return `${symbol} ${convertedAmount.toFixed(2).replace('.', ',')}`;
};

/**
 * ✅ NOVA FUNÇÃO ✅
 * Converte um valor da moeda do utilizador DE VOLTA para a moeda base (EUR).
 * @param {number} amount - O valor na moeda do utilizador (ex: 108 USD).
 * @param {string} currency - A moeda do utilizador (ex: "USD").
 * @returns {number} - O valor convertido para EUR (ex: 100).
 */
export const convertToBaseCurrency = (amount, currency = 'EUR') => {
  const rate = EXCHANGE_RATES[currency] || 1;
  if (rate === 0) return amount; // Evita divisão por zero
  return amount / rate;
};
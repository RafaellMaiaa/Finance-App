import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  FormControl, 
  FormLabel, 
  Select, 
  MenuItem, 
  InputLabel, 
  Typography, 
  CircularProgress, 
  InputAdornment,
  Grid // Importar Grid para layout
} from '@mui/material';
import { getCategories } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import { convertToBaseCurrency, CURRENCY_SYMBOLS } from '../utils/currency.js';

function TransactionForm({ onAddTransaction }) {
  const { user } = useAuth();
  const preferredCurrency = user?.preferredCurrency || 'EUR';

  const [description, setDescription] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [type, setType] = useState('gasto');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estado para a moeda selecionada PARA ESTA transação
  const [transactionCurrency, setTransactionCurrency] = useState(preferredCurrency);

  // Atualiza a moeda da transação se a preferida do utilizador mudar
  useEffect(() => {
    setTransactionCurrency(preferredCurrency);
  }, [preferredCurrency]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategoryList(response.data);
      } catch (error) {
        console.error("Erro ao obter categorias:", error);
      }
    };
    if (user) fetchCategories();
  }, [user]);

  const validateForm = () => {
    let tempErrors = {};
    if (!description.trim()) tempErrors.description = "Descrição é obrigatória.";
    if (!amountInput) tempErrors.amount = "Montante é obrigatório.";
    const parsedAmount = parseFloat(amountInput.replace(',', '.')); // Lida com vírgula decimal
    if (isNaN(parsedAmount) || parsedAmount <= 0) tempErrors.amount = "Montante deve ser um número positivo.";
    if (!category) tempErrors.category = "Categoria é obrigatória.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const amountInSelectedCurrency = parseFloat(amountInput.replace(',', '.'));
      // Conversão usando a moeda selecionada no formulário
      const amountInBaseCurrency = convertToBaseCurrency(amountInSelectedCurrency, transactionCurrency);

      await onAddTransaction({ 
        description, 
        amount: amountInBaseCurrency, // Envia sempre em EUR
        type, 
        category, 
        notes 
      });
      
      // Limpar formulário
      setDescription('');
      setAmountInput('');
      setCategory('');
      setNotes('');
      setTransactionCurrency(preferredCurrency); // Volta para a moeda preferida
      setErrors({});
    } catch (error) {
      console.error("Erro no handleSubmit do TransactionForm:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Obtém o símbolo da moeda SELECIONADA para esta transação
  const currentSymbol = CURRENCY_SYMBOLS[transactionCurrency] || '€';

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, border: '1px solid #424242', borderRadius: '15px', mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Adicionar Nova Transação</Typography>
      
      <TextField
        label="Descrição"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        error={!!errors.description} 
        helperText={errors.description}
      />
      
      {/* Grid para colocar Montante e Seletor de Moeda lado a lado */}
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={8}>
          <TextField
            label={`Montante (${currentSymbol})`} // Label usa o símbolo atual
            variant="outlined"
            type="text"
            inputMode="decimal"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            required
            error={!!errors.amount}
            helperText={errors.amount}
            fullWidth // Ocupa a largura da sua coluna na Grid
            InputProps={{
              startAdornment: <InputAdornment position="start">{currentSymbol}</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={4}>
           {/* Novo Seletor de Moeda */}
          <FormControl fullWidth>
            <InputLabel>Moeda</InputLabel>
            <Select
              value={transactionCurrency}
              label="Moeda"
              onChange={(e) => setTransactionCurrency(e.target.value)}
            >
              {Object.keys(CURRENCY_SYMBOLS).map((currencyCode) => (
                <MenuItem key={currencyCode} value={currencyCode}>
                  {currencyCode} ({CURRENCY_SYMBOLS[currencyCode]})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <FormControl>
        <FormLabel>Tipo</FormLabel>
        <RadioGroup row value={type} onChange={(e) => setType(e.target.value)}>
          <FormControlLabel value="gasto" control={<Radio />} label="Gasto" />
          <FormControlLabel value="ganho" control={<Radio />} label="Ganho" />
        </RadioGroup>
      </FormControl>

       <FormControl fullWidth required error={!!errors.category}>
        <InputLabel>Categoria</InputLabel>
        <Select
          value={category}
          label="Categoria"
          onChange={(e) => setCategory(e.target.value)}
        >
          {categoryList.map((cat) => (
            <MenuItem key={cat._id} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
        {errors.category && <Typography color="error" variant="caption" sx={{ ml: 2, mt: 0.5 }}>{errors.category}</Typography>}
      </FormControl>

      <TextField
        label="Notas (Opcional)"
        variant="outlined"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        multiline
        rows={2}
      />
      
      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Adicionar'}
      </Button>
    </Box>
  );
}

export default TransactionForm;
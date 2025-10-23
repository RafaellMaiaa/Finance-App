import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Select, MenuItem, InputLabel, Typography, CircularProgress, InputAdornment } from '@mui/material';
import { getCategories } from '../services/api.js';

function TransactionForm({ onAddTransaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('gasto');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ NOVO ESTADO PARA GUARDAR OS ERROS ✅
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategoryList(response.data);
      } catch (error) {
        console.error("Erro ao obter categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ NOVA FUNÇÃO DE VALIDAÇÃO ✅
  const validateForm = () => {
    let tempErrors = {};
    if (!description.trim()) tempErrors.description = "Descrição é obrigatória.";
    if (amount === '' || amount === null) tempErrors.amount = "Montante é obrigatório.";
    if (amount !== '' && isNaN(parseFloat(amount))) tempErrors.amount = "Montante deve ser um número.";
    if (!category) tempErrors.category = "Categoria é obrigatória.";
    
    setErrors(tempErrors);
    // Retorna true se não houver erros (o objeto está vazio)
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 1. Validar antes de submeter
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddTransaction({ description, amount: parseFloat(amount), type, category, notes });
      setDescription('');
      setAmount('');
      setCategory('');
      setNotes('');
      setErrors({}); // Limpa os erros em caso de sucesso
    } catch (error) {
      // O erro já é mostrado pelo Snackbar no DashboardPage
      console.error('Erro no submit da transação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, border: '1px solid #424242', borderRadius: '15px', mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Adicionar Nova Transação</Typography>
      
      {/* CAMPOS COM VALIDAÇÃO INTEGRADA */}
      <TextField
        label="Descrição"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        error={!!errors.description}
        helperText={errors.description}
      />
      <TextField
        label="Montante"
        variant="outlined"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        error={!!errors.amount}
        helperText={errors.amount}
        InputProps={{
          startAdornment: <InputAdornment position="start">€</InputAdornment>
        }}
      />
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
        {/* Mostra a mensagem de erro para o Select */}
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
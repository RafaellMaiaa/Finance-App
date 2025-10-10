import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Select, MenuItem, InputLabel, Typography } from '@mui/material';
import { getCategories } from '../services/api.js';

function TransactionForm({ onAddTransaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('gasto');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState(''); // ✅ Novo estado para as notas
  const [categoryList, setCategoryList] = useState([]);

  // useEffect para ir buscar as categorias quando o componente é montado
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategoryList(response.data); // Guarda a lista de categorias no nosso estado
      } catch (error) {
        console.error("Erro ao obter categorias para o formulário:", error);
      }
    };

    fetchCategories();
  }, []); // O array vazio [] significa que isto só corre uma vez

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !category) { // Agora a categoria também é obrigatória
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    onAddTransaction({ description, amount: parseFloat(amount), type, category, notes });
    
    // Limpar o formulário
    setDescription('');
    setAmount('');
    setCategory('');
    setNotes('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, border: '1px solid #424242', borderRadius: '15px', mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Adicionar Nova Transação</Typography>
      <TextField
        label="Descrição"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <TextField
        label="Montante (€)"
        variant="outlined"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <FormControl>
        <FormLabel>Tipo</FormLabel>
        <RadioGroup row value={type} onChange={(e) => setType(e.target.value)}>
          <FormControlLabel value="gasto" control={<Radio />} label="Gasto" />
          <FormControlLabel value="ganho" control={<Radio />} label="Ganho" />
        </RadioGroup>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Categoria</InputLabel>
        <Select
          value={category}
          label="Categoria"
          onChange={(e) => setCategory(e.target.value)}
        >
          {/* ✅ DROPDOWN DINÂMICO AQUI ✅ */}
          {/* Criamos um MenuItem para cada categoria na nossa lista */}
          {categoryList.map((cat) => (
            <MenuItem key={cat._id} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* ✅ NOVO CAMPO DE NOTAS ADICIONADO AQUI ✅ */}
      <TextField
        label="Notas (Opcional)"
        variant="outlined"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        multiline
        rows={2}
      />
      <Button type="submit" variant="contained" color="primary">
        Adicionar
      </Button>
    </Box>
  );
}

export default TransactionForm;
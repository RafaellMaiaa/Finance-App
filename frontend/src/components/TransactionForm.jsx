import React, { useState } from 'react';
import { Box, TextField, Button, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Select, MenuItem, InputLabel, Typography } from '@mui/material';

function TransactionForm({ onAddTransaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('gasto');
  const [category, setCategory] = useState('Outros');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) {
      alert('Por favor, preencha a descrição e o montante.');
      return;
    }
    onAddTransaction({ description, amount: parseFloat(amount), type, category });
    // Limpar o formulário
    setDescription('');
    setAmount('');
    setCategory('Outros');
    setType('gasto');
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
       <FormControl fullWidth>
        <InputLabel>Categoria</InputLabel>
        <Select
          value={category}
          label="Categoria"
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="Alimentação">Alimentação</MenuItem>
          <MenuItem value="Habitação">Habitação</MenuItem>
          <MenuItem value="Transporte">Transporte</MenuItem>
          <MenuItem value="Lazer">Lazer</MenuItem>
          <MenuItem value="Salário">Salário</MenuItem>
          <MenuItem value="Outros">Outros</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Adicionar
      </Button>
    </Box>
  );
}

export default TransactionForm;
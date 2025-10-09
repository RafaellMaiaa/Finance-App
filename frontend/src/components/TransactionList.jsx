import React from 'react';
import { List, ListItem, ListItemText, IconButton, Paper, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function TransactionList({ transactions, onDeleteTransaction }) {
  if (!transactions || transactions.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Ainda não há transações. Adicione uma para começar!</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, border: '1px solid #424242', borderRadius: '15px' }}>
      <Typography variant="h6" sx={{ mb: 2, px: 2 }}>Histórico de Transações</Typography>
      <List>
        {transactions.map((t) => (
          <ListItem
            key={t._id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteTransaction(t._id)}>
                <DeleteIcon />
              </IconButton>
            }
            sx={{ borderBottom: '1px solid #333' }}
          >
            <ListItemText
              primary={t.description}
              secondary={t.category}
            />
            <Typography
              sx={{ fontWeight: 'bold', color: t.type === 'ganho' ? 'success.main' : 'error.main' }}
            >
              {t.amount.toFixed(2).replace('.',',')} €
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default TransactionList;
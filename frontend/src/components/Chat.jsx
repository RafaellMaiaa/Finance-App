import React, { useState, useRef, useEffect } from 'react';
import { askAi } from '../services/api'; // Usar o nosso novo serviço
import { Box, TextField, List, ListItem, ListItemText, Paper, Typography, CircularProgress, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function Chat() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Olá! Adicione as suas transações e depois pergunte-me o que quiser sobre elas.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // A CHAMADA À API AGORA É MUITO MAIS SIMPLES!
      const response = await askAi(currentInput); 
      const aiMessage = { sender: 'ai', text: response.data.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = { sender: 'ai', text: '❌ Erro de conexão. Verifique se o servidor backend está a correr.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // O resto do código JSX (a parte do return) pode permanecer exatamente igual
  // ...
  return (
    <Paper elevation={5} sx={{ height: '70vh', display: 'flex', flexDirection: 'column', borderRadius: '15px' }}>
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg, index) => (
          <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <Paper
              elevation={2}
              sx={{
                p: 1.5,
                maxWidth: '70%',
                bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                borderRadius: msg.sender === 'user' ? '20px 5px 20px 20px' : '5px 20px 20px 20px',
                border: msg.sender === 'ai' ? '1px solid #424242' : 'none',
              }}
            >
              <ListItemText primaryTypographyProps={{ style: { whiteSpace: "pre-wrap" } }} primary={msg.text} />
            </Paper>
          </ListItem>
        ))}
        {isLoading && (
          <ListItem sx={{ justifyContent: 'flex-start' }}>
            <CircularProgress size={24} sx={{color: 'text.secondary'}} />
          </ListItem>
        )}
        <div ref={messagesEndRef} />
      </List>

      <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', p: 2, borderTop: '1px solid #424242' }}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Qual foi o meu maior gasto este mês?"
          disabled={isLoading}
          sx={{ mr: 1 }}
        />
        <IconButton type="submit" color="primary" disabled={isLoading}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default Chat;
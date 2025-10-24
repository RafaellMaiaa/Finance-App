import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // 1. Importar a biblioteca
import { askAi } from '../services/api.js';
import { Box, TextField, List, ListItem, ListItemText, Paper, Typography, CircularProgress, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function Chat() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Olá! 👋 Sou o Flow, o seu assistente financeiro. Adicione as suas transações e depois pergunte-me o que quiser!' }
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
      const response = await askAi(currentInput); 
      const aiMessage = { sender: 'ai', text: response.data.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = { sender: 'ai', text: '❌ Desculpe, tive um problema a ligar ao servidor. Tente novamente.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={5} sx={{ height: '70vh', display: 'flex', flexDirection: 'column', borderRadius: '15px' }}>
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg, index) => (
          <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <Paper
              elevation={2}
              sx={{
                p: 1.5,
                maxWidth: '85%', // Aumentar um pouco a largura máxima
                bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                borderRadius: msg.sender === 'user' ? '20px 5px 20px 20px' : '5px 20px 20px 20px',
                border: msg.sender === 'ai' ? '1px solid #424242' : 'none',
                overflowWrap: 'break-word', // Garante que texto longo quebra a linha
              }}
            >
              {/* ✅ 2. USAR O ReactMarkdown AQUI ✅ */}
              <ListItemText 
                primary={<ReactMarkdown>{msg.text}</ReactMarkdown>} 
                // Permite que o ListItemText renderize HTML/Componentes
                primaryTypographyProps={{ component: 'div' }} 
              />
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

      {/* ... (O Box com o TextField e o botão SendIcon permanecem iguais) ... */}
       <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', p: 2, borderTop: '1px solid #424242' }}>
         <TextField
           fullWidth
           variant="outlined"
           value={input}
           onChange={(e) => setInput(e.target.value)}
           placeholder="Pergunte algo ao Flow..."
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
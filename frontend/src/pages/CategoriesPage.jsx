import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, List, ListItem, ListItemText, IconButton,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../hooks/useAuth.js';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api.js';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // Controla a janela de Adicionar/Editar
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // Categoria a ser editada/apagada
  const [categoryName, setCategoryName] = useState('');
  const { logout } = useAuth();

  // Função para ir buscar as categorias ao backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) logout();
      console.error("Erro ao obter categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenDialog = (category = null) => {
    if (category) {
      setIsEditing(true);
      setCurrentCategory(category);
      setCategoryName(category.name);
    } else {
      setIsEditing(false);
      setCurrentCategory(null);
      setCategoryName('');
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (isEditing && currentCategory) {
      // Lógica para atualizar
      await updateCategory(currentCategory._id, { name: categoryName });
    } else {
      // Lógica para criar
      await createCategory({ name: categoryName });
    }
    fetchCategories(); // Recarrega a lista
    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem a certeza que quer apagar esta categoria?')) {
      await deleteCategory(id);
      fetchCategories(); // Recarrega a lista
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Gerir Categorias
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Categoria
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <List>
            {categories.map((category) => (
              <ListItem
                key={category._id}
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(category)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" sx={{ ml: 1 }} onClick={() => handleDelete(category._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={category.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Janela (Dialog) para Adicionar/Editar Categoria */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nome da Categoria"
            type="text"
            fullWidth
            variant="standard"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave}>{isEditing ? 'Guardar Alterações' : 'Criar'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CategoriesPage;
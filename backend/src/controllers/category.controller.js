import Category from '../models/category.model.js';

// Obter todas as categorias do utilizador logado
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort('name');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter as categorias.' });
  }
};

// Criar uma nova categoria
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'O nome é obrigatório.' });
    }
    const newCategory = new Category({
      name,
      user: req.user._id,
    });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar a categoria. O nome pode já existir.' });
  }
};

// Atualizar uma categoria
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: id, user: req.user._id }, // Condições para encontrar
      { name }, // Dados a atualizar
      { new: true, runValidators: true } // Opções
    );
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar a categoria.' });
  }
};

// Apagar uma categoria
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOneAndDelete({ _id: id, user: req.user._id });
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }
    res.status(200).json({ message: 'Categoria apagada com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar a categoria.' });
  }
};
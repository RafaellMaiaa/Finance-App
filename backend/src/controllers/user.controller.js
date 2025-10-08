import User from '../models/user.model.js';

// @desc   Obter o perfil do utilizador logado
// @route  GET /api/users/me
export const getUserProfile = async (req, res) => {
  // O req.user é injetado pelo nosso middleware 'protect'
  const user = await User.findById(req.user.id).select('-password');
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404).json({ error: 'Utilizador não encontrado.'});
  }
};

// @desc   Atualizar o perfil do utilizador
// @route  PUT /api/users/me
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    // Poderíamos adicionar outros campos para atualizar aqui no futuro
    
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404).json({ error: 'Utilizador não encontrado.'});
  }
};
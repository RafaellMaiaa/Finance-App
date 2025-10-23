import User from '../models/user.model.js';

// Obter o perfil completo, incluindo a moeda
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      preferredCurrency: user.preferredCurrency, // ✅ Devolve a moeda
    });
  } else {
    res.status(404).json({ error: 'Utilizador não encontrado.' });
  }
};

// Atualizar o perfil, permitindo alterar o nome E a moeda
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.preferredCurrency = req.body.preferredCurrency || user.preferredCurrency; // ✅ Permite atualizar a moeda
    
    // Validação extra para garantir que a moeda é válida
    const allowedCurrencies = ['EUR', 'USD', 'GBP', 'BRL'];
    if (req.body.preferredCurrency && !allowedCurrencies.includes(req.body.preferredCurrency)) {
      return res.status(400).json({ error: 'Moeda inválida.' });
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      preferredCurrency: updatedUser.preferredCurrency, // ✅ Devolve a moeda atualizada
    });
  } else {
    res.status(404).json({ error: 'Utilizador não encontrado.' });
  }
};
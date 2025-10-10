import Budget from '../models/budget.model.js';

// Obter os orçamentos do utilizador para um mês e ano específicos
export const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query; // Ex: /api/budgets?month=10&year=2025
    if (!month || !year) {
      return res.status(400).json({ error: 'O mês e o ano são obrigatórios.' });
    }

    const budgets = await Budget.find({
      user: req.user._id,
      month: parseInt(month),
      year: parseInt(year),
    });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter os orçamentos.' });
  }
};

// Criar ou atualizar um orçamento (lógica "upsert")
export const setBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;
    if (!category || amount == null || !month || !year) {
      return res.status(400).json({ error: 'Categoria, valor, mês e ano são obrigatórios.' });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month, year }, // Procura por isto
      { amount }, // Atualiza ou insere isto
      { new: true, upsert: true, runValidators: true } // Opções: devolve o novo, cria se não existir
    );

    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao definir o orçamento.' });
  }
};

// Apagar um orçamento
export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOneAndDelete({ _id: id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ error: 'Orçamento não encontrado.' });
    }

    res.status(200).json({ message: 'Orçamento apagado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar o orçamento.' });
  }
};
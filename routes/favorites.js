const express = require('express');
const router = express.Router();
const { Favorite } = require('../models');

router.get('/favorites', async (req, res) => {
  const favorites = await Favorite.findAll();
  res.json(favorites);
});

router.post('/favorites', async (req, res) => {
  const { baseCurrency, targetCurrency } = req.body;
  console.log('Received body:', req.body);  // Log the request body
  try {
    const newFavorite = await Favorite.create({ baseCurrency, targetCurrency });
    console.log('New favorite created:', newFavorite);  // Log the newly created favorite
    res.json(newFavorite);
  } catch (error) {
    console.error('Error creating new favorite:', error);
    res.status(500).json({ error: 'Failed to create new favorite' });
  }
});

// Delete a favorite
router.delete('/favorites/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const favorite = await Favorite.findByPk(id);
    if (favorite) {
      await favorite.destroy();
      res.json({ message: 'Favorite deleted' });
    } else {
      res.status(404).json({ error: 'Favorite not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { Favorite } = require('../models');

router.get('/favorites', async (req, res) => {
  const favorites = await Favorite.findAll();
  res.json(favorites);
});

router.post('/favorites', async (req, res) => {
  const { baseCurrency, targetCurrency } = req.body;
  console.log('Received body:', req.body);  // Log the request body for debugging
  try {
    const newFavorite = await Favorite.create({ baseCurrency, targetCurrency });
    res.json(newFavorite);
  } catch (error) {
    console.error('Error creating new favorite:', error);
    res.status(500).json({ error: 'Failed to create new favorite' });
  }
});

module.exports = router;

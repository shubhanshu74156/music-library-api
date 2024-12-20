const express = require('express');
const verifyTokenMiddleware = require('../middlewares/verifyToken');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoritesController'); 

const router = express.Router();

router.get('/:category', verifyTokenMiddleware, getFavorites); 
router.post('/add-favorite', verifyTokenMiddleware, addFavorite);
router.delete('/remove-favorite/:id', verifyTokenMiddleware, removeFavorite);

module.exports = router;

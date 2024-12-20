const express = require('express');
const authRoutes = require('./authRoutes'); 
const userRoutes = require('./userRoutes'); 
const albumRoutes = require('./albumRoutes')
const artistRoutes = require('./artistRoutes')
const trackRoutes = require('./trackRoutes')
const favoriteRoutes = require('./favoritesRoutes')

const router = express.Router();

router.use('/', authRoutes); 
router.use('/users', userRoutes); 
router.use('/albums',albumRoutes);
router.use('/artists',artistRoutes);
router.use('/tracks',trackRoutes);
router.use('/favorites', favoriteRoutes);

module.exports = router;

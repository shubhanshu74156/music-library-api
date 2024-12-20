const express = require('express');
const verifyTokenMiddleware = require('../middlewares/verifyToken');
const { getArtists, getArtistById, addArtist, updateArtist, deleteArtist } = require('../controllers/artistController'); 

const router = express.Router();

router.get('/', verifyTokenMiddleware, getArtists); 
router.get('/:artist_id', verifyTokenMiddleware, getArtistById);
router.post('/add-artist', verifyTokenMiddleware, addArtist);
router.put('/:artist_id', verifyTokenMiddleware, updateArtist);
router.delete('/:artist_id', verifyTokenMiddleware, deleteArtist);

module.exports = router;

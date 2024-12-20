const express = require('express');
const verifyTokenMiddleware = require('../middlewares/verifyToken');
const { getArtists, getArtistById, addArtist, updateArtist, deleteArtist } = require('../controllers/artistController'); 
const {allowAdminAndEditor} = require('../middlewares/roleMiddleware')
const router = express.Router();

router.get('/', verifyTokenMiddleware, getArtists); 
router.get('/:artist_id', verifyTokenMiddleware, getArtistById);
router.post('/add-artist', verifyTokenMiddleware,allowAdminAndEditor, addArtist);
router.put('/:artist_id', verifyTokenMiddleware,allowAdminAndEditor, updateArtist);
router.delete('/:artist_id', verifyTokenMiddleware,allowAdminAndEditor, deleteArtist);

module.exports = router;

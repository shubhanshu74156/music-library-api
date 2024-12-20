const express = require('express');
const verifyTokenMiddleware = require('../middlewares/verifyToken');
const { getAlbums, getAlbumById, addAlbum, updateAlbum, deleteAlbum } = require('../controllers/albumController'); 

const router = express.Router();

router.get('/', verifyTokenMiddleware, getAlbums); 
router.get('/:album_id', verifyTokenMiddleware, getAlbumById);
router.post('/add-album', verifyTokenMiddleware, addAlbum);
router.put('/:album_id', verifyTokenMiddleware, updateAlbum);
router.delete('/:album_id', verifyTokenMiddleware, deleteAlbum);

module.exports = router;

const express = require('express');
const verifyTokenMiddleware = require('../middlewares/verifyToken');
const { getAlbums, getAlbumById, addAlbum, updateAlbum, deleteAlbum } = require('../controllers/albumController'); 
const {allowAdminAndEditor} = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/', verifyTokenMiddleware, getAlbums); 
router.get('/:album_id', verifyTokenMiddleware, getAlbumById);
router.post('/add-album', verifyTokenMiddleware,allowAdminAndEditor, addAlbum);
router.put('/:album_id', verifyTokenMiddleware,allowAdminAndEditor, updateAlbum);
router.delete('/:album_id', verifyTokenMiddleware,allowAdminAndEditor, deleteAlbum);

module.exports = router;

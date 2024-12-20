const express = require('express');
const verifyTokenMiddleware = require('../middlewares/verifyToken');
const { getTracks, getTrackById, addTrack, updateTrack, deleteTrack } = require('../controllers/trackController');

const router = express.Router();

router.get('/', verifyTokenMiddleware, getTracks);
router.get('/:track_id', verifyTokenMiddleware, getTrackById); 
router.post('/add-track', verifyTokenMiddleware, addTrack);
router.put('/:track_id', verifyTokenMiddleware, updateTrack);
router.delete('/:track_id', verifyTokenMiddleware, deleteTrack);

module.exports = router;

const express = require('express');
const verifyTokenMiddleware = require('../middlewares/verifyToken');
const { getTracks, getTrackById, addTrack, updateTrack, deleteTrack } = require('../controllers/trackController');
const {allowAdminAndEditor} = require('../middlewares/roleMiddleware')
const router = express.Router();

router.get('/', verifyTokenMiddleware, getTracks);
router.get('/:track_id', verifyTokenMiddleware, getTrackById); 
router.post('/add-track', verifyTokenMiddleware,allowAdminAndEditor, addTrack);
router.put('/:track_id', verifyTokenMiddleware,allowAdminAndEditor, updateTrack);
router.delete('/:track_id', verifyTokenMiddleware,allowAdminAndEditor, deleteTrack);

module.exports = router;

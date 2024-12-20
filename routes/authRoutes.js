const express = require('express');
const { signup, login, logout } = require('../controllers/authController'); 
const router = express.Router();
const verifyTokenMiddleware = require('../middlewares/verifyToken');


router.post('/signup', signup); 
router.post('/login', login); 
router.get('/logout', verifyTokenMiddleware, logout);

module.exports = router;

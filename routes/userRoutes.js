const express = require('express');
const verifyTokenMiddleware = require('../middlewares/verifyToken');
const { getUsers, addUser, deleteUser, updatePassword } = require('../controllers/userController');

const router = express.Router();

router.get('/', verifyTokenMiddleware, getUsers);
router.post('/add-user', verifyTokenMiddleware, addUser);
router.delete('/:user_id', verifyTokenMiddleware, deleteUser);
router.put('/update-password', verifyTokenMiddleware, updatePassword);

module.exports = router;

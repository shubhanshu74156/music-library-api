const express = require('express');
const verifyTokenMiddleware = require('../middlewares/verifyToken');
const { getUsers, addUser, deleteUser, updatePassword } = require('../controllers/userController');
const {allowAdmin} = require('../middlewares/roleMiddleware')
const router = express.Router();

router.get('/', verifyTokenMiddleware,allowAdmin, getUsers);
router.post('/add-user', verifyTokenMiddleware,allowAdmin, addUser);
router.delete('/:user_id', verifyTokenMiddleware,allowAdmin, deleteUser);
router.put('/update-password', verifyTokenMiddleware, updatePassword);

module.exports = router;

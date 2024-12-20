const Roles = require("../constants/roles");
const { User } = require("../models");
const responseHelper = require('../utils/responseHelper');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
    
    const limit = parseInt(req.query.limit) || 5; 
    const offset = parseInt(req.query.offset) || 0; 
    const role = req.query.role;

    let lowerCaseRole; 
    if (role) {
        lowerCaseRole = role.toLowerCase();
        
        if (lowerCaseRole !== Roles.EDITOR && lowerCaseRole !== Roles.VIEWER) {
            return res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request: Invalid Role", null));
        }
    }

    try {
        const queryOptions = {
            where: { organization_id: req.user.organization_id }, 
            limit,
            offset,
            attributes: ['user_id', 'email', 'role', 'created_at']
        };

        if (lowerCaseRole) {
            queryOptions.where.role = lowerCaseRole; 
        }

        const users = await User.findAll(queryOptions); 

        res.status(200).json(responseHelper.generateResponse(200, users, "Users retrieved successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(responseHelper.generateResponse(500, null, "Internal Server Error", error.message));
    }
};

const addUser = async (req, res) => {
    
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request: Missing required fields", null));
    }

    const lowerCaseRole = role.toLowerCase();

    if (lowerCaseRole === Roles.ADMIN) {
        return res.status(403).json(responseHelper.generateResponse(403, null, "Cannot assign admin role", null));
    }

    if (lowerCaseRole !== Roles.EDITOR && lowerCaseRole !== Roles.VIEWER) {
        return res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request: Role must be either 'editor' or 'viewer'", null));
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json(responseHelper.generateResponse(409, null, "Email already exists.", null));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hashedPassword,
            role: lowerCaseRole,
            organization_id: req.user.organization_id,
            created_at: new Date()
        });

        res.status(201).json(responseHelper.generateResponse(201, null, "User created successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(responseHelper.generateResponse(500, null, 'Something went wrong', error.message));
    }
};

const deleteUser = async (req, res) => {

    const userId = req.params.user_id; 

    try {
        const userToDelete = await User.findOne({ where: { user_id: userId, organization_id: req.user.organization_id } });
        if (!userToDelete) {
            return res.status(404).json(responseHelper.generateResponse(404, null, "User not found.", null));
        }

        await User.destroy({ where: { user_id: userId } });

        res.status(200).json(responseHelper.generateResponse(200, null, "User deleted successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, 'Bad Request', null));
    }
};

const updatePassword = async (req, res) => {
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
        return res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request", null));
    }

    try {
        console.log(req.user.user_id)
        const user = await User.findOne({ where: { user_id: req.user.user_id, organization_id: req.user.organization_id, email: req.user.email } });

        if (!user) {
            return res.status(404).json(responseHelper.generateResponse(404, null, "User not found.", null));
        }

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            return res.status(403).json(responseHelper.generateResponse(403, null, "Forbidden Access", null));
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 10);

        user.password = hashedNewPassword;
        user.updated_at = new Date()
        await user.save(); 

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json(responseHelper.generateResponse(500, null, 'Something went wrong', error.message));
    }
};

module.exports = { getUsers, addUser, deleteUser, updatePassword }; 
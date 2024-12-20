const bcrypt = require('bcrypt');
const { User, Organization } = require('../models'); 
const Roles = require('../constants/roles');
const responseHelper = require('../utils/responseHelper');
const validateFields = require('../utils/validationHelper');
const jwtHelper = require('../utils/jwtHelper');

const signup = async (req, res) => {
    const requiredFields = ['email', 'password']; 
    const validationError = validateFields(requiredFields, req.body);
    
    if (validationError) {
        const response = responseHelper.generateResponse(validationError.status, null, validationError.message, null)
        return res.status(validationError.status).json(response);
    }

    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            const response = responseHelper.generateResponse(409, null, "Email already exists.", null)
            return res.status(409).json(response);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newOrganization = await Organization.create({
            created_at: new Date()
        });

        const role = Roles.ADMIN; 
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role,
            organization_id: newOrganization.organization_id,
            created_at: new Date()
        });
        const response = responseHelper.generateResponse(201, null, "User created successfully.", null)
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        const response = responseHelper.generateResponse(500, null, 'Something went wrong', error.message)
        res.status(500).json(response);
    }
};

const login = async (req, res) => {
    const requiredFields = ['email', 'password']; 

    const validationError = validateFields(requiredFields, req.body);
    if (validationError) {
        const response = responseHelper.generateResponse(validationError.status, null, validationError.message, null)
        return res.status(validationError.status).json(response);
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            const response = responseHelper.generateResponse(404, null, "User not found.", null)
            return res.status(404).json(response);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const response = responseHelper.generateResponse(400, null, "Bad Request", null)
            return res.status(400).json(response); 
        }

        const payload = {
                user_id: user.user_id,
                email: user.email,
                role: user.role,
                organization_id: user.organization_id 
            }
        
        const token = jwtHelper.generateToken(payload);
        const response = responseHelper.generateResponse(200, { token }, "Login successful.", null)
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        const response = responseHelper.generateResponse(500, null, 'Something went wrong', error.message)
        res.status(500).json(response);
    }
};
const logout = (req, res) => {
    if (!req.user) {
        const response = responseHelper.generateResponse(400, null, "Bad Request", null)
        return res.status(400).json(response); 
    }
    const response = responseHelper.generateResponse(200, null, "User logged out successfully.", null)
    res.status(200).json(response);
};


module.exports = { signup, login, logout }; 


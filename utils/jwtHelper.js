const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '6h'; 

const jwtHelper = {
 
  generateToken: (payload, expiresIn = '6h') => {
    try {
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
      return token;
    } catch (error) {
      throw new Error('Error generating token');
    }
  },

  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
};

module.exports = jwtHelper;

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    development: {
        dialect: process.env.DIALECT,
        storage: process.env.STORAGE 
    },
    test: {
      dialect: process.env.DIALECT,
        storage: process.env.STORAGE  
    },
    production: {
      dialect: process.env.DIALECT,
        storage: process.env.STORAGE  
    }
};

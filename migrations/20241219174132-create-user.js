'use strict';

const Roles = require('../constants/roles');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: 'organizations', 
            key: 'organization_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [Object.values(Roles)] 
        }
      },
      created_at: { 
        type: Sequelize.DATE,
        allowNull: false,
        
      },
      updated_at: { 
        type: Sequelize.DATE,
        
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Albums', {
      album_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
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
      artist_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'artists',
          key: 'artist_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('Albums');
  }
};
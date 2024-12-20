'use strict';
const {
  Model
} = require('sequelize');
const Roles = require('../constants/roles');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Organization, {
        foreignKey: 'organization_id',
        as: 'organization'
      });
      User.hasMany(models.Favorite, {
        foreignKey: 'user_id',
        as: 'favorites'
      });
    }
  }
  User.init({
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
          model: 'organizations', 
          key: 'organization_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
  },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(Roles)] 
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true
  });
  return User;
};
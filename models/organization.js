'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Organization.hasMany(models.User, {
        foreignKey: 'organization_id',
        as: 'users'
      });
      Organization.hasMany(models.Artist, {
        foreignKey: 'organization_id',
        as: 'artists'
      });
      Organization.hasMany(models.Album, {
        foreignKey: 'organization_id',
        as: 'albums'
      });
      Organization.hasMany(models.Track, {
        foreignKey: 'organization_id',
        as: 'tracks'
      });
    }

  }
  Organization.init({
    organization_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Organization',
    tableName: 'organizations',
    underscored: true,
    timestamps: true
  });
  return Organization;
};
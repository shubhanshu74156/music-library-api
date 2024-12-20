'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Artist.belongsTo(models.Organization, {
        foreignKey: 'organization_id',
        as: 'organization'
      });
      Artist.hasMany(models.Album, {
        foreignKey: 'artist_id',
        as: 'albums'
      });
      Artist.hasMany(models.Track, {
        foreignKey: 'artist_id',
        as: 'tracks'
      });
    }
  }
  Artist.init({
    artist_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    grammy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Artist',
    tableName: 'artists',
    underscored: true,
    timestamps: true
  });
  return Artist;
};
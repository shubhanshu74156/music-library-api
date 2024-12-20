'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Track extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Track.belongsTo(models.Organization, {
        foreignKey: 'organization_id',
        as: 'organization'
      });
      Track.belongsTo(models.Album, {
        foreignKey: 'album_id',
        as: 'album'
      });
      Track.belongsTo(models.Artist, {
        foreignKey: 'artist_id',
        as: 'artist'
      });
    }
  }
  Track.init({
    track_id: {
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
    album_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'albums',
        key: 'album_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    artist_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'artists',
        key: 'artist_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Track',
    tableName: 'tracks',
    underscored: true,
    timestamps: true
  });
  return Track;
};
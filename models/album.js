'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Album.belongsTo(models.Organization, {
        foreignKey: 'organization_id',
        as: 'organization'
      });
      Album.belongsTo(models.Artist, {
        foreignKey: 'artist_id',
        as: 'artist'
      });
      Album.hasMany(models.Track, {
        foreignKey: 'album_id',
        as: 'tracks'
      });
    }
  }
  Album.init({
    album_id: {
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
    year: {
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
    modelName: 'Album',
    tableName: 'albums',
    underscored: true,
    timestamps: true
  });
  return Album;
};
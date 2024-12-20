'use strict';
const {
  Model
} = require('sequelize');
const Categories = require('../constants/categories');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorite.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      Favorite.belongsTo(models.Artist, {
        foreignKey: 'item_id',
        as: 'artist', 
      });
      Favorite.belongsTo(models.Album, {
        foreignKey: 'item_id',
        as: 'album',
      });
      Favorite.belongsTo(models.Track, {
        foreignKey: 'item_id',
        as: 'track', 
      });
    }
  }
  Favorite.init({favorite_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  category: {
    type: DataTypes.ENUM(Categories.ARTIST, Categories.ALBUM, Categories.TRACK),
    allowNull: false
  },
  item_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  hidden: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Favorite',
  tableName: 'favorites',
  underscored: true,
  timestamps: true
});
  return Favorite;
};
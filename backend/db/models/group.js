'use strict';
const {
  Model
} = require('sequelize');
const {User} = require('./user')
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {

    static associate(models) {
      Group.belongsTo(models.User, {foreignKey: "organizerId"});
      Group.hasMany(models.Membership, {foreignKey: "groupId"})
      Group.belongsToMany(models.User, { through: models.Membership, uniqueKey: 'groupId' })
      Group.hasMany(models.GroupImage, {foreignKey: "groupId"});
      Group.hasMany(models.Venue, {foreignKey: "groupId"});
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        is: /(Online|In person)/i
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    numMembers: DataTypes.INTEGER,
    previewImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',

  });
  return Group;
};

/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('review_item', {
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    redeemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ratingScore: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'review_item',
    timestamps: false
  });
};

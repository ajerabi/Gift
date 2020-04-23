/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('redeem_item', {
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    redeemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    point: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'redeem_item',
    timestamps: false
  });
};

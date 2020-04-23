/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('redeems', {
    redeemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement : true
    },
    point: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'redeems',
    timestamps: false
  });
};

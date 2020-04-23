const dbConfig = require("../config/config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.items = require("./items.js")(sequelize, Sequelize);
db.redeems = require("./redeems.js")(sequelize, Sequelize);
db.redeemItem = require("./redeem_item.js")(sequelize, Sequelize);
db.reviewItem = require("./review_item.js")(sequelize, Sequelize);

// Dependents items -> redeem_item
db.items.hasMany(db.redeemItem, { foreignKey: 'itemId' , as: "redeemItem"});
db.redeemItem.belongsTo(db.items, {foreignKey: 'itemId', as: "items"});

// Dependents redeem -> redeem_item
db.redeems.hasMany(db.redeemItem, { foreignKey: 'redeemId' , as: "redeemItem"});
db.redeemItem.belongsTo(db.redeems, {foreignKey: 'redeemId', as: "redeems"});


// Dependents redeem_item -> review_item
db.redeemItem.hasMany(db.reviewItem, { foreignKey: "redeemId",as: "redeemReviewItem" });
db.reviewItem.belongsTo(db.redeemItem, {
  foreignKey: "redeemId",
  as: "redeems",
});

db.redeemItem.hasMany(db.reviewItem, { foreignKey: "itemId",as: "ItemReviewItem" });
db.reviewItem.belongsTo(db.redeemItem, {
  foreignKey: "itemId",
  as: "items",
});

module.exports = db;
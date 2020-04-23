/* jshint indent: 2 */

// module.exports 
const item = (sequelize, DataTypes) => {
  const Item = sequelize.define('items', {
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement : true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    point: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    info: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    
  }, {
    tableName: 'items',
    timestamps: true
  });

  Item.decreaseStock = async (id,qty) => {
    let stock = await Item.update({ qty: sequelize.literal('qty - ' + qty) }, { where: { itemId: id } });
    return stock;
  };

  Item.findWithReview = async (id) => {
    let find = await sequelize.query(
      'SELECT *, totalReview("itemId"), rating("itemId") FROM items WHERE "itemId" = ?',
      {
        plain: true,
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      }
    );
    return find;
  };
  Item.findOneItem = async(where) =>{
    const item = await Item.findOne({
      where: where,
      raw: true,
      attributes: {
        include: [
          [sequelize.fn('totalReview', sequelize.col('itemId')), 'totalreview'],
          [sequelize.fn('rating', sequelize.col('itemId')), 'rating'],
        ]
      }
    });
    return item;
  }
  
  Item.findAllItem = async(where,order,offset,limit) =>{
    const item = { count, rows } = await Item.findAndCountAll({
      where: where,
      raw: true,
      offset: offset,
      limit : limit,
      order: [
        [sequelize.fn('rating', sequelize.col('itemId')), order.rating],
        ['createdAt', order.createdAt]
      ],
      attributes: {
        include: [
          [sequelize.fn('totalReview', sequelize.col('itemId')), 'totalreview'],
          [sequelize.fn('rating', sequelize.col('itemId')), 'rating'],
        ]
      }
    });
    return item;
  }

  return Item;
};

module.exports = item;
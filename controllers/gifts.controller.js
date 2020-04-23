const db = require("../models");
const Item = db.items;
const Redeem = db.redeems;
const RedeemItem = db.redeemItem;
const ReviewItem = db.reviewItem;
const Op = db.Sequelize.Op;

const fs = require('fs')
const path = require('path');
const appDir = path.dirname(require.main.filename);
const { check, validationResult } = require('express-validator');

// Create and Save a new Item
exports.addGift = async (req, res) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let extractedErrors = []
      errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
      return res.status(422).json({
        errors: extractedErrors,
      })
    }
    if (!req.file) {
      return res.status(422).send({
        image: "Image can not be empty!"
      });
      return;
    }
    
    console.log(req.body.name);
    const addItem = {
        name: req.body.name,
        point: req.body.point,
        qty: req.body.stock,
        info: req.body.description,
        image: req.file.filename,
        status: 1
    };
    const item = await Item.create(addItem);
    
    return res.status(201).send({
      message: "Add Gift item successful.",
      item:{
        id: item.itemId,
        name: item.name,
        point: item.point,
        stock: item.qty,
        description: item.info,
        image_path: `gifts/images/${item.image}`
      }
    });
  }catch (error){
    console.log(error);
    return res.status(500).send({
      message: error.message || "Some error occurred while creating the Item."
    });
  }
   
};

// Retrieve all Items from the database.
exports.getGift = async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let rows = parseInt(req.query.rows) || 6;
  let create_at = req.query.create_at || 'DESC';
  let rating = req.query.rating || 'DESC';
  let name = req.query.name || null;
  let stock = parseInt(req.query.stock) || 0;
  
  let filter = {
    name: name ? { [Op.iLike]: `%${name}%` } : null,
    qty: stock ? { [Op.gte]: stock } : null
  };
  Object.keys(filter).forEach((key) => (filter[key] == null) && delete filter[key]);

  let order = {
    createdAt: create_at,
    rating: rating
  };

  let offset = page * rows - rows;
  let limit = rows;
  
  try {
    const item = await Item.findAllItem(filter, order,offset,limit);
    let extractedItem = []
    item.rows.map(item => extractedItem.push({ 
        id: item.itemId,
        name: item.name,
        point: item.point,
        stock: item.qty,
        description: item.info,
        total_rating: item.rating,
        total_review: item.totalreview,
        image_path: `/gifts/images/${item.image}`
    }))
    let totalPage = Math.ceil(item.count/rows);
    
    return res.status(200).send({
      total_result: item.count,
      total_page: totalPage,
      links:{
        self: req.protocol + '://' + req.get('host') + req.baseUrl + req.path,
        prev: req.protocol + '://' + req.get('host') + req.baseUrl + req.path + '?page=' + (page == 1 ? 1 : (page - 1)),
        next: req.protocol + '://' + req.get('host') + req.baseUrl + req.path + '?page=' + (page == totalPage ? totalPage : (page + 1)),
        last: req.protocol + '://' + req.get('host') + req.baseUrl + req.path + '?page=' + totalPage
      },
      item:extractedItem,
    });  
    
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: "Error retrieving Items"
    });
  }
};

// Find a single Item with an id
exports.getOneGift = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    
    const item = await Item.findOneItem({
      itemId: id
    });
    if (!item || (item.status == 0)) {
        return res.status(404).send({
            message: 'Item Not Found!'
        });
    }
    
    const reviewItem = await ReviewItem.findAll({
      where : {
        itemId: id
      }
    });
    
    let extractedreviewItem = []
    reviewItem.map(review => extractedreviewItem.push({ 
      rating: review.ratingScore,
      review: review.review 
    }))

    return res.status(200).send({
      item:{
        id: item.itemId,
        name: item.name,
        point: item.point,
        stock: item.qty,
        description: item.info,
        total_rating: item.rating,
        total_review: item.totalreview,
        image_path: `/gifts/images/${item.image}`,
        review: extractedreviewItem
      }
    });  
  
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: "Error retrieving Item with id=" + id
    });
  }
};

// Update a Item by the id in the request
exports.updateGift = async(req, res) => {
  const id = req.params.id;
  console.log(id);
  try{
    const item = await Item.findByPk(id);
    if (!item || (item.status == 0)) {
        return res.status(404).send({
            message: 'Item Not Found!'
        });
    }
    
    const updateItem = {
      name: req.body.name,
      point: req.body.point,
      qty: req.body.stock,
      info: req.body.description,
      image: (req.file) ?  req.file.filename : null,
      status: req.body.status
    };
    
    Object.keys(updateItem).forEach((key) => (updateItem[key] == null) && delete updateItem[key]);

    const update = await Item.update(updateItem, {
      where: { itemId: id }
    })

    if (update == 1) {
      let imagepath = appDir + "/public/images/" + item.image;
      if (fs.existsSync(imagepath)) {
        //file exists
        fs.unlinkSync(imagepath)
      }
      return res.send({
        message: "Item was updated successfully."
      });
    } else {
      return res.status(202).send({
        message: `Cannot update Item with id=${id}. Maybe Item was not found or req.body is empty!`
      });
    }
  }catch (error){
    console.log(error);
    return res.status(500).send({
      message: "Error updating Item with id=" + id
    });
  }

};

// Delete a Item with the specified id in the request
exports.deleteGift = (req, res) => {
  const id = req.params.id;

  Item.destroy({
    where: { itemId: id }
  })
    .then(num => {
      if (num == 1) {
        return res.send({
          message: "Item was deleted successfully!"
        });
      } else {
        return res.send({
          message: `Cannot delete Item with id=${id}. Maybe Item was not found!`
        });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({
        message: "Could not delete Item with id=" + id
      });
    });
};


// Redeem gift
exports.redeemGift = async (req, res) => {
  const id = req.params.itemId;
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let extractedErrors = []
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
        return res.status(422).json({
          errors: extractedErrors,
        })
      }
      const item = await Item.findByPk(id);
      if (!item || (item.status == 0)) {
          return res.status(404).send({
              message: 'Item Not Found!'
          });
      }else if(item.qty < req.body.quantity){
          return res.status(202).send({
              message: 'Invalid quantity!'
          });
      }
      const redeem = await Redeem.create({
                          point: (parseInt(req.body.quantity,10) * parseInt(item.point,10))
                      });
      const redeemItem = await RedeemItem.create({
                              itemId: id,
                              redeemId: redeem.redeemId,
                              qty: req.body.quantity,
                              point: redeem.point
                          });       
      await Item.decreaseStock(id,req.body.quantity);
      return res.status(201).send({
          message: 'Redeem was successful',
          data: {
              redeem_id: redeem.redeemId,
              total_point: redeem.point,
              time: redeem.time,
              item:[{
                  item_id: id,
                  name: item.name,
                  quantity: redeemItem.qty,
                  point: parseInt(redeemItem.point,10)
              }]
              
          }
      });        

    }catch (error){
      console.log(error);
      return res.status(500).send({
          message: "Error redeem gifts with id=" + id
      });
    }
};

// Review gift
exports.reviewGift = async (req, res) => {
    const id = req.params.itemId;
    console.log(id);
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let extractedErrors = []
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
        
        return res.status(422).json({
          errors: extractedErrors,
        })
      }
      const review = {
        itemId: req.params.itemId,
        redeemId: req.body.redeem_id,
        ratingScore: req.body.score,
        review: (req.body.review) ?  req.body.review : null
      };

      const redeemItem = await RedeemItem.findOne({
        where : {
          itemId: review.itemId,
          redeemId: review.redeemId
        }
      });
      if (!redeemItem) {
        return res.status(404).send({
            message: 'Redeem gift Not Found!'
        });
      }
      
      const reviewItem = await ReviewItem.findOne({
        where : {
          itemId: review.itemId,
          redeemId: review.redeemId
        }
      });
      if (reviewItem) {
        return res.status(404).send({
            message: 'Gift has been reviewed!'
        });
      }else{
        const addReview = await ReviewItem.create(review);
        return res.status(201).send({
          message: 'Review was successful',
          data: {
            item_id: addReview.itemId,
            redeem_id: addReview.redeemId,
            score : addReview.ratingScore,
            review: addReview.review
          }
        });   
      }     
    }catch (error){
      console.log(error);
      return res.status(500).send({
          message: "Error review gifts with id=" + id
      });
    }
};
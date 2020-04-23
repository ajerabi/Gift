module.exports = app => {
    const items = require("../controllers/items.controller");
    const gifts = require("../controllers/gifts.controller");
    
    var router = require("express").Router();
    const multer = require('multer');
    const fileType = require('file-type')
    const fs = require('fs')
    const path = require('path');
    const appDir = path.dirname(require.main.filename);
    const { check, validationResult } = require('express-validator');
    
    //Storage path for upload image
    var storage = multer.diskStorage({   
        destination: function(req, file, cb) { 
           cb(null, './public/images');    
        }, 
    });
    
    //File filter for upload image
    function fileFilter (req, file, cb) {    
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);
        
        if(mimetype && extname){
            return cb(null,true);
        } else {
            cb('Error: Images Only!');
        }
    }

    //Function for upload image
    const upload = multer({
        storage: storage,
        limits : {fileSize : 1024 * 1024 * 5, files:1},
        fileFilter : fileFilter
    });

    
    // Create a new Item
    router.post("/", upload.single("image"), [
        check('name', 'Name is required').notEmpty(),
        check('point', 'Point is required').notEmpty(),
        check('point', 'Point should be a number').isInt(),
        check('stock', 'Stock is required').notEmpty(),
        check('stock', 'Stock should be a number').isInt({ min: 0}),
        check('description', 'Description is required').notEmpty()  
    ],gifts.addGift);
    
    // Retrieve all Items
    router.get("/", gifts.getGift);

    // Retrieve a single Item with id
    router.get("/:id", gifts.getOneGift);
  
    // Update a Item with id
    router.patch("/:id", upload.single("image"), [
        check('point', 'Point should be a number').isInt(),
        check('stock', 'Stock should be a number').isInt()
    ],gifts.updateGift);
  
    // Delete a Item with id
    router.delete("/:id", gifts.deleteGift);

    // Redeem a single Gift 
    router.post("/:itemId/redeem",[
        check('itemId', 'Item ID should be a number').isInt(),
        check('quantity', 'Quantity should be a number').isInt()
    ], gifts.redeemGift);

    // Rating/Review Gift 
    router.post("/:itemId/rating",[
        check('itemId', 'Item ID should be a number').isInt(),
        check('redeem_id', 'Redeem ID should be a number').isInt(),
        check('score', 'Score should be a number minimum 1 and maximum 5').isInt({ min: 1, max: 5 })
    ], gifts.reviewGift);
    
    // Show image 
    router.get('/images/:imagename', (req, res) => {
        let imagename = req.params.imagename;
        let imagepath = appDir + "/public/images/" + imagename;
        let image = fs.readFileSync(imagepath);
        let mime = fileType(image).mime;
    
        res.writeHead(200, {'Content-Type': mime });
        res.end(image, 'binary');
    });
    
    app.use('/gifts', router);
};
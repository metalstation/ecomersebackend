const router = require('express').Router();
const { body, validationResult } = require('express-validator');

const multer = require('multer')

// importing model 
const Product = require('../../models/Product');
const Categories = require('../../models/Categories');

//importing middleware for admin checking 
const FetchAdmin = require('../../middlewares/FetchAdmin');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/products/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + '_' + file.originalname)
    }
})

const upload = multer({ storage: storage })

// get categories of blgos 
router.get('/categories', async (req, res) => {
    try {
        let all = await Categories.findOne().select("products");
        let { products } = all
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})

// add product route , AdminAccess 
router.post('/add',
    [
        body('name', 'Name Should be atleast 3 characters').isLength({ min: 3 })
    ],
    FetchAdmin,
    upload.array('images', 5),
    async (req, res) => {
        const errors = validationResult(req);

        // if (!errors.isEmpty()) {
        //     return res.status(401).json({ success:false , msg: "All Fields are Required"})
        // }
        try {
            if (!req.body.category) {
                return res.status(400).json({ success: false, msg: "Category Required" });
            }

            // add categories to the categories section
            let allCategories = await Categories.findOne();

            // first time create model if there is no data 
            if (!allCategories) {
                console.log('categories not found')
                let a = new Categories({
                    products: req.body.subCategory
                })
                await a.save();
            }
            // if we have the data then add new categories 
            else {
                let { subCategory } = req.body;
                console.log(subCategory);
                let newCategories = [];

                if (subCategory.length) {
                    subCategory.forEach(element => {
                        if (!allCategories.products.includes(element)) {
                            newCategories.push(element);
                        }
                    });
                }
                await Categories.updateOne({ $addToSet: { products: { $each: newCategories } } });
                // await Categories.updateOne({$pushAll: {blogs:['google','fb']}},{upsert:true});
            }

            const { name,
                shortDescription,
                description,
                category,
                subCategory,
                length,
                height,
                width,
                color,
                weight,
                diamerter,
                price,
                range
            } = req.body;

            // save a product 
            let product = new Product({
                name: name,
                shortDescription: shortDescription,
                description: description,
                category: category,
                subCategory: subCategory,
                price: price ? price : null,
                range: range,
                details: {
                    length: length,
                    height: height,
                    width: width,
                    weight: weight,
                    diamerter: diamerter,
                    color: color,
                },
                img: req.files.map(element => {
                    return element.path
                })
            })
            let newProduct = await product.save();
            return res.status(200).json({ success: true, data: newProduct });


        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: 'Internal Server Error' });
        }

    })


// Delete Product :: AdminAccess 
router.put('/delete'
    , FetchAdmin,
    async (req, res) => {
        try {

            let product = await Product.findByIdAndUpdate(req.body.id);

            if (!product) {
                return res.status(400).json({ success: false, msg: "Product is Not Available" })
            }

            product.isDeleted = true

            await product.save();

            res.status(200).json({ success: true, data: "product is deleted" });

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: 'Internal Server Error' });
        }

    })
// Undo Delete A ß Product :: AdminAccess 
router.put('/undo'
    , FetchAdmin,
    async (req, res) => {
        try {

            let product = await Product.findByIdAndUpdate(req.body.id);

            if (!product) {
                return res.status(400).json({ success: false, msg: "Product is Not Available" })
            }
            if (!product.isDeleted) {
                return res.status(400).json({ success: false, msg: "Product is Not in Deleted List" })
            }
            product.isDeleted = false;
            await product.save();
            res.status(200).json({ success: true, data: "product is retrived back" });

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: 'Internal Server Error' });
        }

    })

// Edit Product :: Admin Access 
router.put('/edit',
    [
        body('name', 'Name Should be atleast 5 characters').isLength({ min: 5 })
    ],
    FetchAdmin,
    upload.array('images', 5),
    async (req, res) => {
        const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(401).json({ success:false , msg: "All Fields are Required" })
        // }
        try {

            let product = await Product.findByIdAndUpdate(req.body.id);

            if (!product) {
                return res.status(400).json({ success: false, msg: "Product is Not Available" })
            }
            if (!req.body.category || !req.body.subCategory) {
                return res.status(400).json({ success: false, msg: "Category Required" });
            }

            const { name,
                shortDescription,
                description,
                category,
                subCategory,
                length,
                height,
                width,
                color,
                weight,
                diamerter,
                price,
                range
            } = req.body;

            // save a product 
            product = new Product({
                name: name ? name : product.name,
                shortDescription: shortDescription ? shortDescription : product.shortDescription,
                description: description ? description : product.description,
                category: category ? category : product.category,
                subCategory: subCategory ? subCategory : product.subCategory,
                price: price ? price : product.price ? product.price : null,
                range: range ? range : product.range,
                details: {
                    length: length ? length : product.length,
                    height: height ? height : product.height,
                    width: width ? width : product.width,
                    weight: weight ? weight : product.weight,
                    diamerter: diamerter ? diamerter : product.diamerter,
                    color: color ? color : product.color,
                },
            })
            if (req.files) {
                product.img = req.files.map(element => {
                    return element.path
                })
            }
            let newProduct = await product.save();
            return res.status(200).json({ success: true, data: newProduct });


        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, msg: 'Internal Server Error' });
        }
    })

module.exports = router;


// steel  
// aluminium 
// automobile 
// old machinary  
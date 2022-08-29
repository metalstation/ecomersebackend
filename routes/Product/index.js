const router = require('express').Router();


//importing product routes
const Product = require('./Product');
const Find = require('./Find');

const ProductModel = require('../../models/Product')

router.get('/featured', async (req, res) => {
    try {
        let products = await ProductModel.find({ isFeatured: true });
        res.status(200).json({ success: true, products: products })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
})

router.use('/', Product);
router.use('/find', Find);
module.exports = router; 
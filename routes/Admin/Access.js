const router = require('express').Router();
const mongoose = require('mongoose')

// Models 
const Users = require('../../models/User');
const Carts = require('../../models/Cart');
const Orders = require('../../models/Order');
const Products = require('../../models/Product')
// Middlewares 
const FetchAdmin = require('../../middlewares/FetchAdmin');

// 1::Profile 
router.get('/profile/:id', FetchAdmin, async (req, res) => {
    try {
        let id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, msg: "Invalid Object Id" });
        }
        let user = await Users.findById(id).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, msg: "User Not Found" });
        }
        return res.status(400).json({ success: true, user: user });
    } catch (error) {
        console.log(error.message);
        res.status(500).status({ success: false, msg: "Internal Server Error" });
    }
})


// 2::WishList 
router.get('/wishlist/:id',
    FetchAdmin,
    async (req, res) => {
        try {
            let id = req.params.id;
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ success: false, msg: "Invalid Object Id" });
            }

            let user = await Users.findById(id).populate("wishlist");
            let products = await Products.find();
            let list = products.filter((product) => {
                if (user.wishlist.includes(product._id)) {
                    return product
                }
            })
            return res.status(200).json({ success: true, products: list });

        } catch (error) {

            console.log(error.message);
            res.status(200).json({ success: false, msg: "Internal Server Error" });
        }
    })

// 3::User Cart
router.get("/cart/:id", FetchAdmin, async (req, res) => {
    try {
        let id = req.params.id;
        let data = await Carts.aggregate([
            [
                {
                    $match: {
                        userid: mongoose.Types.ObjectId(id),
                    },
                },
                {
                    $unwind: {
                        path: '$products'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'products.productid',
                        foreignField: '_id',
                        as: 'products.product'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        products: {
                            $push: '$products'
                        }
                    }
                },
            ]
        ])
        return res.status(200).json({ success: true, cart: data });

    } catch (error) {

        console.log(error.message);
        res.status(200).json({ success: false, msg: "Internal Server Error" });
    }
});

module.exports = router 
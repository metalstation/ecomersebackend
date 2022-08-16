const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");


// importing middlewares
const FetchUser = require("../../middlewares/FetchUser");
const FetchAdmin = require('../../middlewares/FetchAdmin');

// importing models
const User = require("../../models/User");
const Product = require("../../models/Product");
const Cart = require('../../models/Cart');

// add to cart 
router.post('/add', FetchUser, async (req, res) => {
    try {
        let { productid, quantity } = req.body;

        if (quantity <= 1 || !quantity) {
            quantity = 1;
        }

        let cart = await Cart.findOne({ userid: req.user.id });
        if (cart) {
            let tempCart = cart;
            let found = 0;
            tempCart.products.map((pro) => {
                if (pro.productid == productid) {
                    found = 1;
                }
            })
            if (found) {
                return res.status(400).json({ success: false, msg: "Already Exists" })
            }
            else {
                tempCart.products.push({ productid: productid, quantity: quantity });
                cart.updateOne({ $set: tempCart })
                let saved = await cart.save();
                res.status(200).json({ success: true, cart: saved });
            }
        }
        // user.updateOne({ $push: { cart: product._id } });
        else {
            console.log('Not Found');
            cart = new Cart({
                userid: req.user.id,
                products: [
                    {
                        productid: productid,
                        quantity: quantity
                    }
                ]
            })
            let saved = await cart.save();
            res.status(200).json({ success: true, cart: saved });
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: true, msg: "Internal Server Error" });
    }
})
// add to cart 
router.delete('/remove', FetchUser, async (req, res) => {
    try {
        const { productid } = req.body;

        let cart = await Cart.findOneAndUpdate({ userid: req.user.id });

        if (cart) {
            let tempCart = cart;
            let products = tempCart.products.filter((p) => p.productid != productid)
            tempCart.products = products;
            cart.updateOne({ $set: tempCart })
            let saved = await cart.save();
            res.status(200).json({ success: true, cart: saved });
        }
        // user.updateOne({ $push: { cart: product._id } });
        else {
            res.status(200).json({ success: false, msg: "Unable to remove from the cart" });
        }

    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})

// update quantity 
router.put('/update', FetchUser, async (req, res) => {
    try {
        let { productid, quantity } = req.body;
        if (quantity <= 1) {
            quantity = 1;
        }
        let cart = await Cart.findOneAndUpdate({ userid: req.user.id })
        if (!cart) {
            return res.status(400).json({ success: false, msg: "can't find cart" });
        }
        let tempCart = cart;
        tempCart.products.map((pro) => {
            if (pro.productid == productid) {
                pro.quantity = quantity;
            }
        })

        await cart.updateOne({ $set: tempCart })
        return res.status(200).json({ success: true, cart: cart })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
})
// route :: getall item from cart
router.get("/getall", FetchUser, async (req, res) => {
    try {
        let data = await Cart.aggregate([
            [
                {
                    $match: {
                        userid: mongoose.Types.ObjectId(req.user.id),
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


module.exports = router; 
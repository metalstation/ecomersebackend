const router = require('express').Router();
const mongoose = require('mongoose')

// importing middlewares 
const FetchUser = require('../../middlewares/FetchUser');

// importing Models 
const User = require('../../models/User');
const Product = require('../../models/Product');
const FetchAdmin = require('../../middlewares/FetchAdmin');
const Order = require('../../models/Order');

// Route :: order Product :: User Protected Route 
router.post('/',
    FetchUser,
    async (req, res) => {
        try {

            let { products, address, price, phone } = req.body;
            // here products is array of objects having ObjectID,quantity 

            // create a order
            let order = new Order({
                userid: req.user.id,
                products: products,
                status: 'pending',
                phone: phone,
                price: price,
                address: address
            })

            let neworder = await order.save();

            res.status(200).json({ success: true, data: neworder });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })

// ordering cancelling :: user cancel route 
router.put('/cancel',
    FetchUser,
    async (req, res) => {
        try {

            // let status = req.params.status 

            let { orderid } = req.body;

            // find order exists 
            let order = await Order.findByIdAndUpdate(orderid);

            if (!order) {
                return res.status(400).json({ success: false, msg: "Order Not Found" });
            }

            order.status = 'cancelled';

            let neworder = await order.save();

            return res.status(200).json({ success: true, msg: "Order Cancelled" });

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })
// ordering status  
router.put('/update',
    FetchAdmin,
    async (req, res) => {
        try {

            // let status = req.params.status 

            let { orderid, status } = req.body;

            if (!req.body.status) {
                return res.status(400).json({ success: false, msg: "Status Required" })

            }

            // find order exists 
            let order = await Order.findByIdAndUpdate(orderid);

            if (!order) {
                return res.status(400).json({ success: false, msg: "Order Not Found" });
            }

            order.status = status;

            let neworder = await order.save();

            return res.status(200).json({ success: true, msg: "Order Confirmed" });

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })
router.get('/getuser',
    FetchUser,
    async (req, res) => {
        try {
            let id = new mongoose.Types.ObjectId(req.user.id);
            // let UserOrders = await Order.find({ userid: id });
            let data = await Order.aggregate([
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
                            // products: {
                            //     $push: '$products'
                            // },
                            items: {
                                $push: '$$ROOT'
                            },
                        }
                    },
                ]
            ])
            // data = data.filter((ord) => ord.userid == req.user.id);
            res.status(200).json({ success: true, orders: data });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })

router.get('/:id', FetchUser, async (req, res) => {
    try {
        let id = new mongoose.Types.ObjectId(req.params.id);
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ success: false, msg: "User Not Found" })
        }
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, msg: "Invalid Object id" })
        }
        let order = null;
        order = await Order.find({ _id: id, userid: req.user.id });
        if (order.length) {
            // return res.status(200).json({ success: true, order: order })
            let data = await Order.aggregate([
                [
                    {
                        $match: {
                            userid: mongoose.Types.ObjectId(req.user.id),
                        },
                        $match: {
                            _id: mongoose.Types.ObjectId(req.params.id),
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
                        $lookup: {
                            from: 'users',
                            localField: 'userid',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },  //if user info is also needed 
                    {
                        $group: {
                            _id: '$_id',
                            // products: {
                            //     $push: '$products'
                            // },
                            items: {
                                $push: '$$ROOT'
                            },
                        }
                    },
                ]
            ])
            return res.status(200).json({ success: true, order: data[0] }); // sending 1st object in array 
        }
        return res.status(400).json({ success: false, msg: "Autherization Error" })
    } catch (error) {

    }
})
router.get('/getall',
    async (req, res) => {
        try {
            // let orders = await Order.find();
            let orders = await Order.aggregate([
                [
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
                            // products: {
                            //     $push: '$products'
                            // },
                            items: {
                                $push: '$$ROOT'
                            },
                        }
                    },
                ]
            ])
            res.status(200).json({ success: true, orders: orders });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" });
        }
    })
module.exports = router; 
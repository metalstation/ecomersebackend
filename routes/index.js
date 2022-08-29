const express = require('express');
const router = express.Router();

// importing routers 
const Auth = require('./auth/index');
const Products = require('./Product/index');
const Blogs = require('./Blogs/index');
const Subscribers = require('./Subscribers/index');
const Emails = require('./Emails/index');
const WishList = require('./WishList/index');
const Sell = require('./Sell/index');
const Orders = require('./Orders/index')
const Feedback = require('./Feedback/index');
const Cart = require('./Cart/index');
const Enquiry = require('./Enquiry/index');
// admin access routes for accessing user specific data too 
const AdminAccess = require('./Admin/index');

//authentication routes 
router.use('/auth', Auth);

//product routes 
router.use('/products', Products);

// blog product routers 
router.use('/blogs', Blogs)

// subscriber routes 
router.use('/subscribers', Subscribers);

// Email - Marketing Routes 
router.use('/emails', Emails);

// wishlist routes 
router.use('/wishlist', WishList)

// sell route (customer selling )
router.use('/sell', Sell);

// order routes 
router.use('/orders', Orders);

// feedback route 
router.use('/feedback', Feedback);

// cart route 
router.use('/cart', Cart);

// enquiry routes
router.use('/enquiry', Enquiry);

// admin access routes
router.use('/access', AdminAccess);

// base root 
router.get('/', (req, res) => {
    res.send('Hello👋')
})

module.exports = router; 
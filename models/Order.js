const mongoose = require('mongoose');

const BuySchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
            },
            _id: false,
        },
    ],
    status: {
        type: String,
        default: 'ordered'
    },
    phone: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    address: {
        pincode: { type: String },
        state: { type: String },
        town: { type: String },
        location: { type: String },
        city: { type: String },
        _id: false,
    },

},
    { timestamps: true })

module.exports = mongoose.model('Order', BuySchema);
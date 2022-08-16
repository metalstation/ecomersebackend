const mongoose = require('mongoose');

const SellSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
    },
    type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    details: {
        pincode: { type: String },
        state: { type: String },
        town: { type: String },
        location: { type: String },
        city: { type: String },
        _id: false,
    },
    images: {
        type: Array,
        default: [],
        required: false
    }
},
    { timestamps: true })

module.exports = mongoose.model('Sell', SellSchema);
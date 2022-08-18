const mongoose = require('mongoose');

const SellSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false
    },
    business: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    material: {
        type: String,
        required: false
    },
    quantity: {
        type: String,
        required: false
    },
    unit: {
        type: String,
        required: false
    },
    others: {
        type: String,
    },
    images: {
        type: Array,
        default: [],
        required: false
    }
},
    { timestamps: true })

module.exports = mongoose.model('Sell', SellSchema);
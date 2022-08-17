const mongoose = require('mongoose');

const SellSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false
    },
    fullName: {
        type: String,
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
    subcategory: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    images: {
        type: Array,
        default: [],
        required: false
    }
},
    { timestamps: true })

module.exports = mongoose.model('Sell', SellSchema);
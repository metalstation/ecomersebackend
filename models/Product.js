const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5
    },
    shortDescription: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: Array,
        required: false,
        default: []
    },
    details: {
        length: {
            type: String,
        },
        height: {
            type: String,
        },
        width: {
            type: String
        },
        weight: {
            type: String
        },
        diameter: {
            type: String
        },
        color: {
            type: String
        },
        _id: false,
    },
    table: [
        {
            fieldName: {
                type: String,
            },
            value: {
                type: String,
            },
            _id: false,
        },
    ],
    isFeatured: {
        type: Boolean,
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    },
    price: {
        type: Number,
        required: false
    },
    minPrice: {
        type: Number,
        required: false
    },
    maxPrice: {
        type: Number,
        required: false
    },
    img: {
        type: Array,
        required: true
    }
},
    { timestamps: true })

module.exports = mongoose.model('Products', ProductSchema);
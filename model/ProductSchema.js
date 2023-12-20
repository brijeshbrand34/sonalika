const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
    },
    productTitle: {
        type: String,
        // required: true
    },
    productCategory: {
        type: String,
        // required: true
    },
    productBrand: {
        type: String,
        // required: true
    },
    productTags: {
        type: String,
        // required: true
    },
    productShortDescription: {
        type: String,
        // required: true
    },
    productDescription: {
        type: String,
        // required: true
    },
    productMainImage: {
        type: [String],
        // type:String,
        // required: true
    },
    productSubCategory: {
        type: String,
        // required: true
    },
    productStock: {
        type: Number,
        // required: true
    },
    productSkuCode: {
        type: String,
        // required: true
    },
    featuredDeals: {
        type: String,
        // required: true
    },
    newCollection: {
        type: String,
        // required: true
    },
    dealsOfTheWeek: {
        type: String,
        // required: true
    },
    labourCharges: {
        type: Number,
        // required: true
    },
    published: {
        type: Boolean,
        // required: true
    },
    productDate: {
        type: Date,
    },
    // Fields for specific categories
    gold: {
        weight: {
            type: Number,
        },
        carat: {
            type: Number,
        },
    },
    Silver: {
        weight: {
            type: Number,
        },
    },
    diamond: {
        carat: {
            type: Number,
        },
        price: {
            type: Number,
        },
    },
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
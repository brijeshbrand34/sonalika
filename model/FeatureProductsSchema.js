const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const FeatureProductsSchema = new mongoose.Schema({

    FeatureProductsTitle: {
        type: String,
        //required:true
    },
    FeatureProductsImage: {
        type: [String],
        //required:true
    },
    FeatureProductsId: {
        type: String,
        //required:true
    },
    FeatureProductsStartDate: {
        type: String
    },
    FeatureProductsEndDate: {
        type: String
    },
    FeatureProductsPublished: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});


const FeatureProducts = mongoose.model('FeatureProducts', FeatureProductsSchema);
module.exports = FeatureProducts;

const mongoose = require('mongoose');
const PriceSchema  = new mongoose.Schema({ 
    GoldPrice: { type: Number, required: true },
    SliverPrice: { type: Number, required: true },
    DimondPrice: { type: Number, required: true},
    Date: { type: String, require: true },
},{
    timestamps:true  
})
const Prices = mongoose.model('Prices', PriceSchema);
module.exports = Prices;
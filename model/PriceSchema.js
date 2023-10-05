const mongoose = require('mongoose');
const PriceSchema  = new mongoose.Schema({ 
    GoldPrice: { type: String, required: true },
    SliverPrice: { type: String, required: true },
    DimondPrice: { type: String, required: true},
    Date: { type: String, require: true },
},{
    timestamps:true  
})
const Prices = mongoose.model('Prices', PriceSchema);
module.exports = Prices;
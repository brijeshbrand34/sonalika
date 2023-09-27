const mongoose = require("mongoose");
const CouponsSchema = new mongoose.Schema(
    {
        CouponsId: { type: String, required: true},
        CouponCode:{type: String, required: true},
        DiscountAmount:{type: String, required: true},
        CouponsStartDate:{type: String, required: true},
        CouponsEndDate:{type: String, required: true},
        Categories:{type: String, required: true}
    },
    {
        timestamps:true 
    })
    const Coupons = mongoose.model('Coupons', CouponsSchema);
    module.exports = Coupons;
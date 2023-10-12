const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const WebsiteHeaderSchema = new mongoose.Schema({
    Email: { type: String, required: true },
    MobileNunber: { type: Number, required: true },
    Image: { type: [String] },
},{
    timestamps:true
})


const WebsiteHeader = mongoose.model('WebsiteHeader', WebsiteHeaderSchema);
module.exports = WebsiteHeader;
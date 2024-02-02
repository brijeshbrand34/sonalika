const mongoose = require('mongoose');
const GemsStonesBanners = new mongoose.Schema(
  {
    gemsBanner: {
      type: String,
      require: true,
    },
    gemsDesc:{
        type:String,
        
    }
  },
  {
    timestamps: true,
  }
);

const GemsStonesBanner = mongoose.model("GemsStonesBanners", GemsStonesBanners);
module.exports = GemsStonesBanner;

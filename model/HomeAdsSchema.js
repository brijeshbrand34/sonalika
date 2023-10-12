const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const HomeAdsSchema = new mongoose.Schema(
  {
    HomeAdsTitle: {
      type: String,
      //required:true
    },
    HomeAdsDiscription: {
      type: String,
      //required:true
    },
    HomeAdsLink: {
      type: String,
      //required:true
    },

    HomeAdsImage: {
      type: [String],
      //required:true
    },
    HomeAdsId: {
      type: String,
      unique: true,
      //required:true
    },
    HomeAdsStartDate: {
      type: String,
    },
    HomeAdsEndDate: {
      type: String,
    },
    HomeAdsPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
HomeAdsSchema.index({ HomeAdsId: 1 }, { unique: true });

const HomeAds = mongoose.model("HomeAds", HomeAdsSchema);
module.exports = HomeAds;

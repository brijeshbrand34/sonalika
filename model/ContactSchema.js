const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    contactId: {
      type: String,
      required: true,
    },
    contactUserName: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    contactWhatAreYouLookingFor: {
      type: String,
      required: true,
    },
    contactWhereDidYouHearAboutUs: {
      type: String,
      required: true,
    },
    contactMessage: {
      type: String,
      required: true,
    },
    // contactDate: {
    //   type: Date,
    //   default: Date.UTC,
    // },
  },
  { timestamps: true }
);

const Contacts = mongoose.model("Contacts", ContactSchema);
module.exports = Contacts;

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SECRET_KEY = process.env.SECRET_KEY;
const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
     
    },
    email: {
      type: String,
     
    },
    password: {
      type: String,
     
    },
    profileImage:{
      type:[String],
      //required:true
  },
  
    tokens: [
      {
        token: {
          type: String,
         
        },
      },
    ]
  
  },
  { timestamps: true },
  
  
);


AdminSchema.pre("save", async function (next) {
  console.log("hi from inside" || this.isNew);
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

AdminSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, SECRET_KEY);
    console.log("token response");
    this.tokens = this.tokens.concat({
      token: token,
    });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;

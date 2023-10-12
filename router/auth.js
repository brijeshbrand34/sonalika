require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

require("../db/conn");
const User = require("../model/UserSchema");
// const Authenticate = require("../middleware/authenticate");
const multer = require('multer');
const path = require('path');

const Cart = require('../model/CartSchema');
function generateUniqueId() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const uniqueId = `${year}${month}${day}${hours}${minutes}${seconds}`;

  return uniqueId;
}
const storage = multer.diskStorage({
  destination: "./backend/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });


router.post("/userRegister", upload.array('profileImage'), async (req, res) => {
  const {
    name,
    email,
    contact,
    password,
    // confirmPassword,
    // city,
    // postalCode,
    // address,
    // gender,
  } = req.body;
  const fileNames = req.files?.map(file => file.filename);
  console.log(fileNames);

  if (
    // !name ||
    !email ||
    !contact ||
    !password
  ) {
    return res.status(422).json({
      error: "Please fill the fields properly",
    });
  }

  try {
    const userExist = await User.findOne({
      email: email,
    });
    console.log(userExist);
    if (userExist) {
      return res.status(422).json({
        error: "Email already exists",
      });
    }
    const user2 = new User({
      name,
      email,
      contact,
      password,
      profileImage: fileNames,
      userId: 'Cust' + generateUniqueId(),
      userCreateDate: new Date(),
      userUpdateDate: new Date()
    });
    const cart = new Cart({
      products: [],
      customer_id: email,
      customer_email: email,
      CartId: 'cart' + generateUniqueId(),
      CartDate: new Date()
    });
    await cart.save();

    await user2.save();
    res.status(201).json({
      message: "User register successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});
router.post('/signin', async (req, res) => {

  try {

    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'plz filled the data' });

    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password,
        userLogin.password);
      token = await userLogin.generateAuthToken();

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 2589000000),
        httpOnly: true
      })
      if (!isMatch) {
        res.status(400).json({ error: 'invalid credentials' });
      }
      else {
        res.json({ message: 'user Signin successfully',userData:userLogin });
      }

    }
    else {
      res.status(400).json({
        error: 'invalid Credentials'
      });
    }

  }
  catch (err) {
    console.log(err);

    res.status(500).json({ error: 'Internal server error' });
  }

})
router.get("/getUserData", async (req, res) => {
  console.log("this is about page");
  const users = await User.find();
  res.send(users);
});

// Delete
router.delete("/deleteUser/:userId", async (req, res) => {
  console.log("Delete User");
  const userId = req.params._id;
  //   const updates = req.body;
  try {
    const deletedUser = await User.findOneAndDelete({
      userId: userId,
    });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update
// router.put("/userUpdate/:userId", async (req, res) => {
//   const userId = req.params._id;
//   const updates = req.body;
//   const { name,contact,password, } = req.body;
//   // const fileNames = req.files.map((file) => file.filename);

//   try {
//     const result = await User.updateOne({ userId: userId }, { $set: {
//       name:name,
//       // email,
//       contact:contact,
//       password:password,
//       // profileImage:fileNames,
// userUpdateDate:new Date()

//     } });

//     if (result.n === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json({ message: "User updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


router.put("/userUpdate/:userId", upload.array('profileImage'), async (req, res) => {
  const userId = req.params.userId;
  const { name, email, password,contact } = req.body;

  try {
    const fileNames = req.files.map((file) => file.filename);

    // Find the admin userId
    const adminToUpdate = await User.findById(userId);

    if (!adminToUpdate) {
      return res.status(404).json({ error: "userId not found" });
    }

    // Update the fields
    adminToUpdate.name = name;
    adminToUpdate.email = email;
    adminToUpdate.contact = contact;
    adminToUpdate.password = password;  // Include the password in the update
    adminToUpdate.profileImage = fileNames;

    // Save the changes to trigger the pre middleware
    await adminToUpdate.save();

    res.status(200).json({ message: "userId updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/logout", (req, res) => {
  console.log("this is logout page");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("user logout");
});
router.get('/user/:userId', async (req, res) => {
  const ReviewproductId = req.params.userId;
  try {
    const user = await User.findOne({ userId: ReviewproductId }); // Fetch the Review based on the provided ID

    if (!user) {
      return res.status(404).json({ error: "Review not found" });
    }

    console.log("Review information for ID", ReviewproductId, ":", user.name);

    res.json({ user }); // Send the Review as JSON response
  } catch (error) {
    console.error("Error fetching Review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;

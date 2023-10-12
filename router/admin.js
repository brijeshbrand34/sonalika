require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

require("../db/conn");
const Admin = require("../model/AdminSchema");
const Authenticates = require("../middleware/authenticateAdmin");
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
  destination: './backend/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


// admin add
router.post("/AdminRegister", upload.array('profileImage'), async (req, res) => {
  const {
    name,
    email,
    password,
    // confirmPassword,
    // profileImage
  } = req.body;
  const fileNames = req.files?.map(file => file.filename);
  console.log(fileNames);
  console.log(req.files.filename);

  if (
    !name ||
    !email ||
    !password
  ) {
    return res.status(422).json({
      error: "Please fill the fields properly",
    });
  }

  try {
    const AdminExist = await Admin.findOne({
      email: email,
    });
    console.log(AdminExist);
    if (AdminExist) {
      return res.status(422).json({
        error: "Email already exists",
      });
    }
    const Admin2 = new Admin({
      name,
      email,
      password,
      profileImage: fileNames
    });
    const cart = new Cart({
      products: [],
      customer_id: email,
      customer_email: email,
      CartId: 'cart' + generateUniqueId(),
      CartDate: new Date()
    });
    await cart.save();

    await Admin2.save();
    res.status(201).json({
      message: "Admin register successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});
//admin login
router.post('/adminSignin', async (req, res) => {
  try {

    let token;
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({ error: 'plz filled the data' });

    }

    const AdminLogin = await Admin.findOne({ email: email });

    if (AdminLogin) {
      const isMatch = await bcrypt.compare(password,
        AdminLogin.password);
      token = await AdminLogin.generateAuthToken();

      res.cookie("jwtokenSona", token, {
        expires: new Date(Date.now() + 2589000000),
        // httpOnly:true
      })
      if (!isMatch) {
        res.status(400).json({ error: 'invalid credentials' });
      }
      else {
        res.json({ message: 'Admin Signin successfully', AdminID: AdminLogin._id ,Admin:AdminLogin });
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

//get admin data
router.get("/getAdminData", async (req, res) => {
  console.log("this is about page");
  const Admins = await Admin.find();
  res.send(Admins);
});


router.get('/admin', Authenticates, (req, res) => {
  console.log("this is about page")
  const responseData = req.rootUser;
  res.send(responseData);
})
// Delete
router.delete("/deleteAdmin/:AdminId", async (req, res) => {
  console.log("Delete Admin");
  const AdminId = req.params._id;
  //   const updates = req.body;
  try {
    const deletedAdmin = await Admin.findOneAndDelete({
      AdminId: AdminId,
    });
    if (!deletedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update
router.put("/AdminUpdate/:AdminId", upload.array('profileImage'), async (req, res) => {
  const AdminId = req.params.AdminId;
  const { name, email, password } = req.body;

  try {
    const fileNames = req.files.map((file) => file.filename);

    // Find the admin
    const adminToUpdate = await Admin.findById(AdminId);

    if (!adminToUpdate) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Update the fields
    adminToUpdate.name = name;
    adminToUpdate.email = email;
    adminToUpdate.password = password;  // Include the password in the update
    adminToUpdate.profileImage = fileNames;

    // Save the changes to trigger the pre middleware
    await adminToUpdate.save();

    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/adminlogout", (req, res) => {
  console.log("this is logout page");
  res.clearCookie("jwtokenSona", { path: "/" });
  res.status(200).send("Admin logout");
});

module.exports = router;
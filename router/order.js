require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
require('../db/conn');
const nodemailer = require('nodemailer');
// require('../../backend/middleware/authenticate')
const { sendConfirmation } = require("../middleware/authenticate");
const Order = require('../model/OrderSchema');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: "gsmtp.gmail.com",
//   port: 587,
//   requireTLS: true,
//   secure: false,
//   auth: {
//               // user: 'inevitableapptest@gmail.com',

//               user: 'zaydsheikh360@gmail.com',
//               // pass: 'fiddtnvwktcucugh'
//               pass: 'fwrkdbtyobxkivdx'

//   }

// });


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

router.post('/addOrder', async (req, res) => {
  const {
    userFirstName,
    userLastName,
    userMobileNo,
    userEmail,
    userZipcode,
    userRegion,
    userAddress1,
    userAddress2,
    // orderId,
    orderDate,
    orderTotalCost,
    statusOfOrder,
    paymentStatus,
    products,
    totalPrice
  } = req.body;

  try {
    // const userExist=await Order.findOne({ userEmail: userEmail });
    //  console.log(userExist)
    //   console.log(userExist)
    //   if (userExist) {
    //       return res.status(422).json({ error: 'Email already exists' });
    //     }
    const orderingId = 'ord' + generateUniqueId();
    const orderData = new Order({
      userFirstName,
      userLastName,
      userMobileNo,
      userEmail,
      userZipcode,
      userRegion,
      userAddress1,
      userAddress2,
      orderId: orderingId,
      orderDate: new Date(),
      orderTotalCost,
      statusOfOrder,
      paymentStatus,
      products,
      totalPrice,
      // orderId,
      orderDate
    });
    await orderData.save();


    // const mailOptions = {
    //   from: 'zaydsheikh360@gmail.com', // Sender's email address
    //   to: 'mauryabrijesh34@gmail.com', // Recipient's email address
    //   subject: "ordered confirmed successfully",
    //   text: "ordered confirmed successfully",
    // };

    // // Send the email
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error('Error sending email:', error);
    //     res.status(500).json({ error: 'Failed to send email.' });
    //   } else {
    //     console.log('Email sent:', info.response);
    //     res.status(200).json({ message: 'Email sent successfully.' });
    //   }
    // });
    //userEmail
    sendConfirmation(userEmail, orderingId);
    res.status(201).json({
      message: 'Order register successfully'
    })


  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  };
});

router.get('/getOrder', async (req, res) => {
  try {
    const orders = await Order.find({}); // Fetch all orders from the database

    console.log("This is the order information:", orders);

    res.json(orders); // Send the orders as JSON response
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get('/getOneOrder/:id', async (req, res) => {
  const orderId = req.params.id;
  console.log("getOne", orderId)
  console.log("get", req.params.id)
  try {
    const order = await Order.findOne({ orderId: orderId }); // Fetch the order based on the provided ID

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    console.log("Order information for ID", orderId, ":", order);

    res.json({ order }); // Send the order as JSON response
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put('/updateOrder/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  const updates = req.body;
  console.log("aaa", orderId)
  console.log("bbbb", req)

  try {
    const result = await Order.updateOne({ orderId: orderId }, { $set: updates });

    if (result.n === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/deleteOrder/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const deletedOrder = await Order.findOneAndDelete({ orderId: orderId });
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;



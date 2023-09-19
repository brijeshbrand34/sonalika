require('../db/conn');
const jwt=require('jsonwebtoken');
const express= require('express');
const bcrypt=require('bcryptjs');
const router=express.Router();
require('../db/conn');
const Cart =require('../model/CartSchema');
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

  router.get('/CartGet', async (req, res) => {
    try {
      const Carts = await Cart.find({}); // Fetch all Carts from the database
      
      console.log("This is the Cart information:", Carts);
      
      res.json( Carts ); // Send the Carts as JSON response
    } catch (error) {
      console.error("Error fetching Carts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router.get('/CartGetOne/:id', async (req, res) => {
    const  customer_email  = req.params.id;
  console.log("getOne",customer_email)
  console.log("get",req.params.id)
    try {
      const carts = await Cart.findOne({customer_email:customer_email}); // Fetch the Cart based on the provided ID
      
      if (!carts) {
        return res.status(404).json({ error: "Cart not found" });
      }
      
      console.log("Cart information for ID", customer_email, ":", carts);
      
      res.json({ carts }); // Send the Cart as JSON response
    } catch (error) {
      console.error("Error fetching Cart:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.put('/CartUpdate/:CartId', async (req, res) => {
    const CartId = req.params.CartId;
    const updates = req.body;
    console.log("llllllll",req.body);
    const products=[{updates}];
    try {
      const result = await Cart.updateOne({ CartId: CartId }, { $set: products });
  
      if (result.n === 0) {
        return res.status(404).json({ error: 'Cart not found' });

      }
  
      res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.delete('/CartDelete/:CartId', async (req, res) => {
    const CartId = req.params.CartId;
    try {
      const deletedCart = await Cart.findOneAndDelete({ CartId: CartId });
      if (!deletedCart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.post('/carts/:id/products', async (req, res) => {
    const cartId = req.params.id;
    const newProduct = req.body;
    console.log(req.body)
  
    try {
      const cart = await Cart.findOne({CartId:cartId});
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      cart.products.push(newProduct);
      await cart.save();
  
      return res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.delete('/carts/:cartId/products/:productId', async (req, res) => {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
  
    try {
      const cart = await Cart.findOne({CartId:cartId});
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Find the index of the product with the given productId
      const productIndex = cart.products.findIndex((product) => product._id.toString() === productId);
  
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
  
      cart.products.splice(productIndex, 1);
      await cart.save();
  
      return res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.put('/carts/:cartId/products/:productId', async (req, res) => {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const updatedProduct = req.body;
  
    try {
      const cart = await Cart.findOne({CartId:cartId});
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Find the index of the product with the given productId
      const productIndex = cart.products.findIndex((product) => product._id.toString() === productId);
  
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
  
      cart.products[productIndex] = updatedProduct;
      await cart.save();
  
      return res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
module.exports=router;



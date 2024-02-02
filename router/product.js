require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const multer = require("multer");
const path = require("path");

require("../db/conn");
const Product = require("../model/ProductSchema");
function generateUniqueId() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

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

// Endpoint to handle form submission
router.post("/addProduct", upload.array("productMainImage"), (req, res) => {
  const {
    productTitle,
    productCategory,
    productBrand,
    productTags,
    productShortDescription,
    productDescription,
    productSubCategory,
    productStock,
    productSkuCode,
    featuredDeals,
    newCollection,
    dealsOfTheWeek,
    labourCharges,
    price,
  } = req.body;

  const fileNames = req.files?.map((file) => file.filename);

  const newData = new Product({
    productId: "prod" + generateUniqueId(),
    productTitle,
    productCategory,
    productBrand,
    productTags,
    productShortDescription,
    productDescription,
    productSubCategory,
    productStock,
    productSkuCode,
    featuredDeals,
    newCollection,
    dealsOfTheWeek,
    labourCharges,
    published: true,
    productDate: new Date(),
    productMainImage: fileNames,
  });

  // Check the product category and add specific fields accordingly
  const { goldWeight, goldCarat } = req.body;
  newData.gold = { weight: goldWeight, carat: goldCarat };
  const { silverWeight } = req.body;
  newData.Silver = { weight: silverWeight };
  const { diamondCarat } = req.body;
  newData.diamond = { carat: diamondCarat, price: price };
  console.log(newData);
  newData
    .save()
    .then((data) => {
      console.log("Data saved to MongoDB:", data);
      res
        .status(200)
        .json({ message: "Form data and files uploaded successfully." });
    })
    .catch((err) => {
      console.error("Error saving data to MongoDB:", err);
      res.status(500).json({ error: "Failed to save form data and files." });
    });
});

router.get("/getProducts", async (req, res) => {
  try {
    const Products = await Product.find({}); // Fetch all Products from the database

    console.log("This is the Product information:", Products);

    res.json(Products); // Send the Products as JSON response
  } catch (error) {
    console.error("Error fetching Products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getOneProduct/:id", async (req, res) => {
  const ProductId = req.params.id;
  console.log("getOne", ProductId);
  console.log("get", req.params.id);
  try {
    const product = await Product.findOne({ productId: ProductId }); // Fetch the Product based on the provided ID

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("Product information for ID", ProductId, ":", Product);

    res.json({ product }); // Send the Product as JSON response
  } catch (error) {
    console.error("Error fetching Product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* router.put('/updateProducts/:ProductId', upload.array('productMainImage'), async (req, res) => {
  const {
    productTitle,
    productCategory,
    productBrand,
    productTags,
    productShortDescription,
    productDescription,

    // productMainImage,
    productPrice,

    productStock,
    published,
    productSkuCode,
    featuredDeals,
    newCollection,
    dealsOfTheWeek, } = req.body;
  const ProductId = req.params.ProductId;

  console.log(req.body);

  //     
  if (!req.files || !req.files.length) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
  const fileNames = req.files?.map(file => file.filename);

  try {
    const result = await Product.updateOne(
      { productId: ProductId },
      {
        $set: {
          productTitle,
          productCategory,
          productBrand,
          productTags,
          productShortDescription,
          productDescription,
          productMainImage: fileNames,
          productPrice,
          productStock,
          productSkuCode,
          featuredDeals,
          newCollection,
          dealsOfTheWeek,
          published: true,
          productDate: new Date(),
        },
      }
    );

    console.log("result-----", result);

    if (result.n === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}); */
router.put(
  "/updateProducts/:ProductId",
  upload.array("productMainImage"),
  async (req, res) => {
    const {
      productTitle,
      productCategory,
      productBrand,
      productTags,
      productShortDescription,
      productDescription,
      productSubCategory,
      productStock,
      published,
      productSkuCode,
      featuredDeals,
      newCollection,
      dealsOfTheWeek,
      labourCharges,
      price,
      productMainImage,
    } = req.body;
    const ProductId = req.params.ProductId;

    console.log(req.body);

    // if (!req.files || !req.files.length) {
    //   return res.status(400).json({ error: "No files uploaded." });
    // }

    const fileNames = req.files?.map((file) => file.filename);

    try {
      const updateFields = {
        productTitle,
        productCategory,
        productBrand,
        productTags,
        productShortDescription,
        productDescription,
        productMainImage: fileNames,
        productSubCategory,
        productStock,
        productSkuCode,
        featuredDeals,
        newCollection,
        dealsOfTheWeek,
        labourCharges,
        published: true,
        productDate: new Date(),
      };

      // Check the product category and add specific fields accordingly
      const { goldWeight, goldCarat } = req.body;
      updateFields.gold = { weight: goldWeight, carat: goldCarat };
      const { silverWeight } = req.body;
      updateFields.Silver = { weight: silverWeight };
      const { diamondCarat } = req.body;
      updateFields.diamond = { carat: diamondCarat, price: price };

      if (!req.files || !req.files.length) {
        const result = await Product.updateOne(
          { productId: ProductId },
          {
            $set: {
              productMainImage: productMainImage,
              productTitle:productTitle,
              productCategory:productCategory,
              productBrand:productBrand,
              productTags:productTags,
              productShortDescription:productShortDescription,
              productDescription:productDescription,
              productSubCategory:productSubCategory,
              productStock:productStock,
              productSkuCode:productSkuCode,
              featuredDeals:featuredDeals,
              newCollection:newCollection,
              dealsOfTheWeek:dealsOfTheWeek,
              labourCharges:labourCharges,
              gold:{ weight: goldWeight, carat: goldCarat },
              Silver:{ weight: silverWeight },
              diamond:{ carat: diamondCarat, price: price },
              published: true,
              productDate: new Date(),
            },
          }
        );

        if (result.n === 0) {
          return res.status(404).json({ error: "Product not found" });
        }

        return res
          .status(200)
          .json({ message: "Product updated with image successfully" });

        // return res.status(400).json({ error: 'No files uploaded.' });
      }
      const result = await Product.updateOne(
        { productId: ProductId },
        {
          $set: updateFields,
        }
      );

      console.log("result-----", result);

      if (result.n === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/deleteProduct/:ProductId", async (req, res) => {
  const ProductId = req.params.ProductId;
  try {
    const deletedProduct = await Product.findOneAndDelete({
      productId: ProductId,
    });
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// To publish the products
// router.put("/publishProduct/:ProductId", async (req, res) => {
//   const { published } = req.body;
//   const ProductId = req.params.ProductId;

//   try {
//     const result = await Product.updateOne(
//       { productId: ProductId },
//       {
//         $set: {
//           published: published,
//         },
//       }
//     );
//     console.log("result-----", result);

//     if (result.n === 0) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     res.status(200).json({ message: "Product published successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
router.post("/publishProduct/:Id", async (req, res) => {
  const Id = req.params.Id;
  try {
    const result = await Product.findOne({ productId: Id });
    if (result) {
      // console.log(result);
      result.published = result.published === true ? false : true;
      await result.save();
      res
        .status(200)
        .json({ message: `Partner Published ${result.published}` });
    } else {
      res.status(400).json({ message: "Partner not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});
module.exports = router;

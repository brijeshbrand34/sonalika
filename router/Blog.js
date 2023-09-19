require('../db/conn');
const jwt=require('jsonwebtoken');
const express= require('express');
const bcrypt=require('bcryptjs');
const router=express.Router();
const path = require('path');

const multer = require('multer');
require('../db/conn');
const Blog =require('../model/BlogSchema');
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
  
  // Endpoint to handle form submission
  router.post('/addBlog', upload.array('blogImage'), (req, res) => {
    const { blogTitle, blogIntroduction,blogText,blogConclusion } = req.body;
    const fileNames = req.files?.map(file => file.filename);
  
    const newData = new Blog({
        BlogId: 'blg'+generateUniqueId(),
        blogTitle: blogTitle,
        blogIntroduction: blogIntroduction,
        blogText:blogText,
        blogConclusion:blogConclusion,
        blogImage: fileNames,
        BlogDate:Date.now(),
    });
  
    newData.save()
      .then(data => {
        console.log('Data saved to MongoDB:', data);
        res.status(200).json({ message: 'Form data and files uploaded successfully.' });
      })
      .catch(err => {
        console.error('Error saving data to MongoDB:', err);
        res.status(500).json({ error: 'Failed to save form data and files.' });
      });
  });
  router.get('/getAllBlogs', async (req, res) => {
    try {
      const Blogs = await Blog.find({}); // Fetch all Blogs from the database
      
      console.log("This is the Blog information:", Blogs);
      
      res.json( Blogs ); // Send the Blogs as JSON response
    } catch (error) {
      console.error("Error fetching Blogs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router.get('/getOneBlog/:id', async (req, res) => {
    const  BlogId  = req.params.id;
  console.log("getOne",BlogId)
  console.log("get",req.params.id)
    try {
      const blog = await Blog.findOne({BlogId:BlogId}); // Fetch the Blog based on the provided ID
      
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      
      console.log("Blog information for ID", BlogId, ":", Blog);
      
      res.json({ blog }); // Send the Blog as JSON response
    } catch (error) {
      console.error("Error fetching Blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


//   router.put('/updateBlog/:BlogId', upload.array('blogImage'), (req, res) => {
//     const { blogTitle, blogIntroduction,blogText,blogConclusion } = req.body;
//     const BlogId = req.params.BlogId;
// //     
//     // if (!req.files || !req.files.length) {
//     //     return res.status(400).json({ error: 'No files uploaded.' });
//     //   }
//     const fileNames = req.files?.map(file => file.filename);
  
//     try {
//         const result =  Blog.updateOne({ BlogId: BlogId }, { $set: {    
//         blogTitle:blogTitle,
//          blogIntroduction:blogIntroduction,
//          blogText:blogText,
//          blogConclusion:blogConclusion,
//          blogImage:blogImage,
//          BlogDate:'j'
//         } });
    
//         if (result.n === 0) {
//           return res.status(404).json({ error: 'Blog not found' });
//         }
    
//         res.status(200).json({ message: 'Blog updated successfully' });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//       }
//   });

router.put('/updateBlog/:BlogId', upload.array('blogImage'), async (req, res) => {
  const { blogTitle, blogIntroduction, blogText, blogConclusion } = req.body;
  const BlogId = req.params.BlogId;

  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const fileNames = req.files.map((file) => file.filename);

    const result = await Blog.updateOne(
      { BlogId: BlogId },
      {
        $set: {
          blogTitle: blogTitle,
          blogIntroduction: blogIntroduction,
          blogText: blogText,
          blogConclusion: blogConclusion,
          blogImage: fileNames, // Use fileNames here instead of blogImage
          
        },
      }
    );

    if (result.n === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  
  router.delete('/deleteBlog/:BlogId', async (req, res) => {
    const BlogId = req.params.BlogId;
    try {
      const deletedBlog = await Blog.findOneAndDelete({ BlogId: BlogId });
      if (!deletedBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports=router;



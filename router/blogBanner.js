require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('../db/conn');
const BlogBanner = require('../model/BlogBannerSchema');
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

// BlogBanner Api to create 
router.post('/addBlogBanner', upload.array('BlogBannerImage'), (req, res) => {
    const { BlogBannerTitle, BlogStartdate, BlogEnddate } = req.body;
    const fileNames = req.files?.map(file => file.filename);
    console.log(fileNames)
    const newData = new BlogBanner({
        BannerId: 'Blogbnr' + generateUniqueId(),
        BannerTitle: BlogBannerTitle,
        BlogBannerStartDate: BlogStartdate,
        BlogBannerImage: fileNames,
        BlogBannerEndDate: BlogEnddate
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

//   Get app blogbanner 
router.get('/getAllBlogBanners', async (req, res) => {
    try {
        const BlogBanners = await BlogBanner.find({}); // Fetch all Banners from the database
        console.log("This is the Banner information:", BlogBanners);
        res.json(BlogBanners); // Send the Banners as JSON response
    } catch (error) {
        console.error("Error fetching Banners:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
);

//   Get One Blog Banner
router.get('/getOneBlogBanner/:id', async (req, res) => {
    const BlogBannerId = req.params.id;
    console.log("getOne", BannerId)
    console.log("get", req.params.id)
    try {
        const Blogbanner = await BlogBanner.findOne({ BlogBannerId: BlogBannerId }); // Fetch the Banner based on the provided ID

        if (!Blogbanner) {
            return res.status(404).json({ error: "BlogBanner not found" });
        }
        console.log("BlogBanner information for ID", BlogBannerId, ":", Blogbanner);
        res.json({ Blogbanner }); // Send the Banner as JSON response
    } catch (error) {
        console.error("Error fetching Banner:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put('/update/Blog-banner/:BlogBannerId', upload.array('BlogBannerImage'), async (req, res) => {
    const { BlogBannerTitle, BlogBannerStartdate, Blogbannerenddate } = req.body;
    const BlogBannerId = req.params.BlogBannerId;
    try {
        if (!req.files || !req.files.length) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }
        const fileNames = req.files.map((file) => file.filename);
        const result = await BlogBanner.updateOne(
            { BlogBannerId: BlogBannerId },
            {
                $set: {
                    BlogBannerTitle: BlogBannerTitle,
                    BlogBannerStarDate: BlogBannerStartdate,
                    BlogBannerEndDate: Blogbannerenddate,
                    BlogBannerImage: fileNames,
                },
            }
        );
        if (result.n === 0) {
            return res.status(404).json({ error: 'Blog-Banner not found' });
        }
        res.status(200).json({ message: 'Blog-Banner updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/deleteBlogBanner/:BlogBannerId', async (req, res) => {
    const BlogBannerId = req.params.BlogBannerId;
    try {
        const deletedBlogBanner = await BlogBanner.findOneAndDelete({ BlogBannerId: BlogBannerId });
        if (!deletedBlogBanner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/publishBlogBanner/:BlogBannerId', async (req, res) => {
    const { published } = req.body;
    const BlogBannerID = req.params.BlogBannerId;

    try {
        const result = await BlogBanner.updateOne(
            { BlogBannerId: BlogBannerID },
            {
                $set: {
                    BlogBannerPublished: published,
                },
            }
        );
        console.log("result-----", result);

        if (result.n === 0) {
            return res.status(404).json({ error: 'BlogBanner Published not found' });
        }

        res.status(200).json({ message: 'BlogBanner published update successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('../db/conn');
const PartnersReview = require('../model/PartnersReviewSchema');
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

router.post('/addPartnersReview', upload.array('PartnersReviewImage'), (req, res) => {
    const { PartnersReviewName, Review } = req.body;
    const fileNames = req.files?.map(file => file.filename);
    console.log(fileNames)
    const newData = new PartnersReview({
        PartnersReviewId: 'PartnersReview' + generateUniqueId(),
        PartnersReviewName: PartnersReviewName,
        PartnersReview: Review,
        PartnersReviewImage: fileNames,
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
// Api for get all PartnersReview 
router.get('/getAllReview', async (req, res) => {
    try {
        const PartnersReviews = await PartnersReview.find({});

        console.log("This is the PartnersReview information:", PartnersReviews);

        res.json(PartnersReviews);
    } catch (error) {
        console.error("Error fetching PartnersReview:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
);

// Get Single PartnersReview 
router.get('/getOnePartnersReview/:id', async (req, res) => {
    const PartnersReviewId = req.params.id;
    console.log("getOne", PartnersReviewId)
    console.log("get", req.params.id)
    try {
        const PartnersReviews = await PartnersReview.findOne({ PartnersReviewId: PartnersReviewId });

        if (!PartnersReviews) {
            return res.status(404).json({ error: "Banner not found" });
        }

        console.log("PartnersReview information for ID", PartnersReviewId, ":", PartnersReviews);

        res.json({ PartnersReviews });
    } catch (error) {
        console.error("Error fetching PartnersReview:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put('/updatePartnerReview/:reviewsId', upload.array('PartnersReviewImage'), async (req, res) => {
    const { PartnersReviewName, Review } = req.body;
    const PartnersReviewId = req.params.reviewsId;
    console.log(req.files,'files')

    try {
        if (!req.files || !req.files.length) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }

        const fileNames = req.files.map((file) => file.filename);

        const result = await PartnersReview.updateOne(
            { PartnersReviewId: PartnersReviewId },
            {
                $set: {
                    PartnersReviewName: PartnersReviewName,
                    PartnersReview: Review,
                    PartnersReviewImage: fileNames,
                },
            }
        );

        if (result.n === 0) {
            return res.status(404).json({ error: 'PartnersReviews not found' });
        }
        res.status(200).json({ message: 'PartnersReviews updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/deletePartnersReviews/:PartnersReviewId', async (req, res) => {
    const PartnersReviewID = req.params.PartnersReviewId;
    try {
        const deletedPartnersReview = await PartnersReview.findOneAndDelete({ PartnersReviewId: PartnersReviewID });
        if (!deletedPartnersReview) {
            return res.status(404).json({ error: 'PartnersReview not found' });
        }
        res.status(200).json({ message: 'PartnersReview deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
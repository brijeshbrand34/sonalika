require('../db/conn');
const express = require('express');
const router = express.Router();
const Careers = require('../model/CareersSchema');
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

router.post('/add-Careers', (req, res) => {
    const { Careerstitle, Careerslink } = req.body;
    const newData = new Careers({
        CareersId: 'career' + generateUniqueId(),
        CareersTitle: Careerstitle,
        CareersLink: Careerslink,
    });

    newData.save()
        .then(data => {
            console.log('Data saved to MongoDB:', data);
            res.status(200).json({ message: 'Form data and files uploaded successfully.' });
        })
        .catch(err => {
            console.error('Error saving data to MongoDB:', err);
            res.status(500).json({ error: 'Failed to save form data and files.' });
        })
});

router.get('/getAllCareers', async (req, res) => {
    try {
        const AllCareers = await Careers.find({});
        console.log("This is the Careers information:", AllCareers);
        res.json(AllCareers);
    } catch (error) {
        console.error("Error fetching AllCareers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/getOneCareers/:id', async (req, res) => {
    const CareersID = req.params.id;
    console.log("getOne", CareersId)
    console.log("get", req.params.id)
    try {
        const Career = await Careers.findOne({ CareersIdId: CareersID });

        if (!Career) {
            return res.status(404).json({ error: "Career not found" });
        }

        console.log("PartnersReview information for ID", CareersIdId, ":", Career);

        res.json({Career});
    } catch (error) {
        console.error("Error fetching Career:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/Careers-update/:CareersId', async (req, res) => {
    const { Careertitles, Careerlink } = req.body;
    const CareersID = req.params.CareersId;

    try {
        const result = await Careers.updateOne(
            { CareersId: CareersID },
            {
                $set: {
                    CareersTitles: Careertitles,
                    CareersLink: Careerlink,
                },
            }
        );

        if (result.n === 0) {
            return res.status(404).json({ error: 'Career not found' });
        }
        res.status(200).json({ message: 'Careers updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/deleteCareers/:CareersId', async (req, res) => {
    const CareersID = req.params.CareersId;
    try {
        const deletedCareers = await Careers.findOneAndDelete({ CareersId: CareersID});
        if (!deletedCareers) {
            return res.status(404).json({ error: 'Careers not found' });
        }
        res.status(200).json({ message: 'Career Options deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
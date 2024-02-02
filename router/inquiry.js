require('../db/conn');
const express = require('express');
const router = express.Router();
const Inquiry = require('../model/InquirySchema');
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

router.post('/InquiryAdd', async (req, res) => {
  const { UserName,
    UserNumber,
    ProductName,
    UserEmail,
    City , ZipCode,description} =  req.body;
    console.log(req.body,'body')

  try {

    const user = new Inquiry({
        UserName,
        UserNumber,
        ProductName,
        UserEmail,
        City ,
        ZipCode, InquiryId: 'Inq' + generateUniqueId(),
        description,
      ReviewDate: new Date()
    });
    console.log(user)
    await user.save();
    res.status(201).json({
      message: 'Inquiry register successfully'
    })

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  };
});


router.get('/Get-All-inquiry', async (req, res) => {
    try {
      const Inquirys = await Inquiry.find({}); // Fetch all Reviews from the database
  
      console.log("This is the Inquiry information:", Inquirys);
  
      res.json(Inquirys); // Send the Reviews as JSON response
    } catch (error) {
      console.error("Error fetching Inquiry:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.put("/inquery-read/:id", async(req, res)=>{
    const inqueryId = req.params.id;
    if(!inqueryId){
        return res.status(404).json({message : "Inqury Id not find"})
    }
      try {
        const inqury = await Inquiry.findById(inqueryId);
        if(!inqury){
            return res.status(404),jsan({message: "Inqury is not eixt with given ".inqueryId })
        }
        inqury.isRead = true;
        await inqury.save();
        return res.status(200).json({massegs: "Inqury is change converted to read"});
      } catch (error) {
        return res.status(500).json({message:"Internal server error "});
      }

  })

  module.exports = router;
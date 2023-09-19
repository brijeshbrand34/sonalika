require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const Contacts = require("../model/ContactSchema");

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

router.post("/addContact", async (req, res) => {
  const {
    // contactId,
    contactUserName,
    contactEmail,
    contactNumber,
    contactWhatAreYouLookingFor,
    contactWhereDidYouHearAboutUs,
    contactMessage,
    // contactDate,
  } = req.body;

  if (
    // !contactId ||
    // !contactUserName ||
    // !contactEmail ||
    // !contactNumber ||
    // !contactWhatAreYouLookingFor ||
    // !contactWhereDidYouHearAboutUs ||
    // !contactMessage
    1 === 0
  ) {
    return res.status(422).json({
      error: "Please fill the fields properly",
    });
  }

  try {
    const contactExist = await Contacts.findOne({
      contactId: req.params.contactId,
    });
    console.log(contactExist);
    if (contactExist) {
      return res.status(422).json({
        error: "contact already exists",
      });
    }
    const newContact = new Contacts({
      contactId: "contact" + generateUniqueId(),
      contactUserName,
      contactEmail,
      contactNumber,
      contactWhatAreYouLookingFor,
      contactWhereDidYouHearAboutUs,
      contactMessage,
      // contactDate,
    });
    await newContact.save();
    res.status(201).json({
      message: "Contact register successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.get("/getContacts", async (req, res) => {
  console.log("this is contact page");
  const contacts = await Contacts.find();
  res.send(contacts);
});

router.delete("/deleteContact/:contactId", async (req, res) => {
  console.log("Delete User");
  // const contactId = req.params.contactId;
  //   const updates = req.body;
  try {
    const deletedContact = await Contacts.findOneAndDelete({
      contactId: req.params.contactId,
    });
    if (!deletedContact) {
      return res.status(404).json({ error: "Contact data not found" });
    }
    res.status(200).json({ message: "Contact data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

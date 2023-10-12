require("../db/conn");
const express = require("express");
const router = express.Router();
const Pages = require("../model/PagesSchema");

router.get("/getAllPages", async (req, res) => {
  try {
    const Page = await Pages.find({});
    console.log("This is the Careers information:", Page);
    res.json(Page);
  } catch (error) {
    console.error("Error fetching AllCareers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getOnePages/:id", async (req, res) => {
  const PagesID = req.params.id;
  console.log("getOne", PagesID);
  console.log("get", req.params.id);
  try {
    const Page = await Pages.findOne({ _id: PagesID });

    if (!Page) {
      return res.status(404).json({ error: "Pages not found" });
    }

    console.log("PartnersReview information for ID", PagesID, ":", Page);

    res.json({ Page });
  } catch (error) {
    console.error("Error fetching Career:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/Pagesupdate/:PagesId", async (req, res) => {
  let { Pagestitle, Pagelink, Pagesdescription } = req.body;

  console.log("Request Body:", req.body);
  const PagesID = req.params.PagesId;
  console.log( 'gjh:',req.params.PagesId)

  try {
    // Check if the career with the specified CareersId exists
    const page = await Pages.findOne({ _id: PagesID });
    console.log("Found Career:", page);

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    // Update the career
    const result = await Pages.updateOne(
      { _id: PagesID },
      {
        $set: {
          PagesTitle: Pagestitle,
          PagesLink: Pagelink,
          PagesDescription: Pagesdescription,
        },
      }
    );
    console.log("Update Result:", result);

    if (result.nModified === 0) {
      return res.status(404).json({ error: "Pages not updated" });
    }

    res.status(200).json({ message: "Pages updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
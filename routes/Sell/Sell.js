const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const multer = require("multer");
// importing models
const Sell = require("../../models/Sell");
const Scrap = require("../../models/Scrap");
const FetchAdmin = require("../../middlewares/FetchAdmin");
const Pagination = require("../../middlewares/Pagination");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/sells/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// routes
router.post(
  "/add",
  upload.array('images', 5),
  async (req, res) => {
    try {
      const { email, business, phone, city, category, material, quantity, unit, others } = req.body;
      if (!phone) {
        return res.status(400).json({ success: false, msg: "Type is Needed" });
      }
      let sell = new Sell({
        email: email,
        phone: phone,
        city: city,
        business: business,
        material: material,
        quantity: quantity,
        unit: unit,
        others: others,
        category: category,
      })

      if (req.files) {
        sell.images = req.files.map(element => {
          return element.path
        })
      }

      let newSell = await sell.save();
      return res.status(200).json({ success: true, data: newSell });
    }
    catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, msg: "Internal Server Error" });
    }

  });

// get all the selling products
router.get("/getsell", FetchAdmin, async (req, res) => {
  try {
    let sells = await Sell.find();
    return res.status(200).json({ success: true, sells: sells })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});
module.exports = router;

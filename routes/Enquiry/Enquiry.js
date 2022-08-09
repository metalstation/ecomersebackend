
const router = require("express").Router();
const mongoose = require("mongoose");
// importing middlewares
const FetchUser = require("../../middlewares/FetchUser");
const FetchAdmin = require("../../middlewares/FetchAdmin");
const Pagination = require("../../middlewares/Pagination");

// importing Models
const User = require("../../models/User");
const Product = require("../../models/Product");
const Enquiry = require("../../models/Enquiry");
const { request } = require("http");

router.get("/", (req, res) => {
  res.status(200).json({ success: false, msg: "welcome to the enquiry page" });
});

// Route :: Post an Enquiry :: User Protected Route
router.post("/add", FetchUser, async (req, res) => {
  try {
    let { productid } = req.body;

    // validate
    if (!mongoose.isValidObjectId(productid)) {
      return res.status(400).json({ success: false, msg: "Invalid Id" });
    }

    // find if product exists
    let product = await Product.findById(productid);
    let users = await User.findById(mongoose.Types.ObjectId(req.user));
    if (!product) {
      return res
        .status(400)
        .json({ success: false, msg: "Product Doesn't exists" });
    }

    // create a Enquiry
    let enquiry = new Enquiry({
      userid: req.user.id,
      productid: productid,
      status: "pending",
      name: users.name,
      productname: product.name,
      email: users.email,
      phone: users.phone ? users.phone : req.body.phone,
    });

    let newEnquiry = await enquiry.save();

    res.status(200).json({ success: true, data: newEnquiry });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});
// getting all enquiry - by user
router.get("/getall", FetchUser, async (req, res) => {
  try {
    const Data = await Enquiry.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productid",
          foreignField: "_id",
          as: "product_data",
        },
      },
      {
        $match: {
          userid: mongoose.Types.ObjectId(req.user.id),
        },
      },
    ]);
    return res.status(200).json({ success: true, data: Data });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// deleting enquiry by user
router.delete("/delete", FetchUser, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.body.id)) {
      return res.status(400).json({ success: false, msg: "Invalid Object" });
    }

    let enquiry = await Enquiry.findById(req.body.id);
    if (!enquiry) {
      return res.status(400).json({ success: false, msg: "Enquiry Not Found" });
    }
    const data = await Enquiry.findByIdAndDelete(req.body.id);

    return res.status(200).json({ success: true, msg: "Enquiry got Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// ADMIN SECTION

// getting all enquiry - by admin
router.get("/getall", FetchAdmin, async (req, res) => {
  try {
    const Data = await Enquiry.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productid",
          foreignField: "_id",
          as: "product_data",
        },
      },
    ]);
    return res.status(200).json({ success: true, data: Data });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// updating status - by admin
router.patch("/accept/:id", FetchAdmin, async (req, res) => {
  try {
    const status = req.body;
    const options = { new: true };
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, msg: "Invalid Object" });
    }
    let enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(400).json({ success: false, msg: "Enquiry Not Found" });
    }
    const a = await Enquiry.findByIdAndUpdate(id, status, options);

    return res.status(200).json({ success: true, data: a });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// get specific user's enquiry - by admin
router.get("/getSpecificUser/:id", FetchAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.find({ userid: req.params.id });
    return res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// get specific product's enquiry - by admin
router.get("/getSpecificProduct/:id", FetchAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.find({ productid: req.params.id });
    return res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

module.exports = router; 


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


// Total routes 
// 1. Add Enquiry :: user :: Done 
// 2. Accept Enquiry :: admin :: 
// 3. Give Price :: admin 
// 4. Get User Enquiries :: user :: DONE 
// 5. Get all Enquiries :: admin :: DONE

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
    let user = await User.findById(mongoose.Types.ObjectId(req.user.id));
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
      name: user.name,
      price: null,
      email: user.email,
      productname: product.name,
      email: user.email,
      phone: user.phone
    });

    let newEnquiry = await enquiry.save();

    res.status(200).json({ success: true, data: newEnquiry });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});
// getting all enquiry - by user
router.get("/getuser", FetchUser, async (req, res) => {
  // console.log('Hello')
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
    ]).sort({ createdAt: -1 });
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
router.put("/update", FetchAdmin, async (req, res) => {
  try {
    const { status, price, id } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, msg: "Invalid Object" });
    }
    let enquiry = await Enquiry.findByIdAndUpdate(id);
    if (!enquiry) {
      return res.status(400).json({ success: false, msg: "Enquiry Not Found" });
    }
    if (price) {
      enquiry.price = price;
    }
    if (status) {
      enquiry.status = status;
    }
    const a = await enquiry.save();
    return res.status(200).json({ success: true, data: a });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// get specific user's enquiry - by admin
// router.get("/getSpecificUser/:id", FetchAdmin, async (req, res) => {
//   try {
//     const enquiry = await Enquiry.find({ userid: req.params.id });
//     return res.status(200).json({ success: true, data: enquiry });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ success: false, msg: "Internal Server Error" });
//   }
// });

// get specific product's enquiry - by admin
// router.get("/getSpecificProduct/:id", FetchAdmin, async (req, res) => {
//   try {
//     const enquiry = await Enquiry.find({ productid: req.params.id });
//     return res.status(200).json({ success: true, data: enquiry });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ success: false, msg: "Internal Server Error" });
//   }
// });

module.exports = router; 

function Pagination(model) {
  return async (req, res, next) => {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let startIndex = (page - 1) * limit;
    let endIndex = (page) * limit - 1;

    // console.log(startIndex , endIndex); 
    // find by category 
    let category = req.query.category;

    // let pagination = {}; 
    let search = req.query.search;

    let query = {};

    try {
      let maxValue = parseInt(req.query.max);
      let minValue = parseInt(req.query.min);

      let pagination = {
        results: {},
        next: null,
        previous: null
      }
      // searching 
      if (req.query.search) {
        query = {
          $or: [
            { "name": { $regex: `${search}`, $options: 'i' } },
            { "category": { $regex: `${search}`, $options: 'i' } },
          ]
        }
      }
      let length = await model.countDocuments() // length 
      // search by category for blogs 
      if (req.query.category) {
        query = { category: { "$in": [req.query.category] } }
      }

      // if we have 

      if (req.query.category) {
        length = model.find(query).countDocuments();
        // length = model.find(query).skip(startIndex).limit(limit).length
      }

      // price filters 
      if (minValue && maxValue) {
        query = {
          price: { $gte: minValue, $lte: maxValue },
        };
        length = await model.find(query).countDocuments();
        // length = length.length;
      }
      pagination.results = await model.find(query).skip(startIndex).limit(limit);
      // length = pagination.results.length;

      pagination.length = length; // total num of items in the 


      // console.log(endIndex,length)
      pagination.current = page;

      pagination.pages = Math.ceil(length / limit); // total number of pages 
      if (endIndex < length - 1) {
        pagination.next = page + 1;
      }
      if (startIndex > 0) {
        pagination.previous = page - 1;
      }
      req.pagination = pagination;
      next();
    } catch (error) {
      res.status(500).json({ success: false, msg: "Internal Server Error", error: error.message })
    }
  }
}

module.exports = Pagination;  
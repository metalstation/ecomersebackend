function BlogsPagination(model) {
    return async (req, res, next) => {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        let startIndex = (page - 1) * limit;
        let endIndex = (page) * limit;
        let search = req.query.search;
        let category = req.query.category;
        let query = {};

        try {
            // store results here 
            let pagination = {
                results: {},
                next: null,
                previous: null
            }
            let length = await model.countDocuments() // length 

            pagination.length = length; // total num of items in the 
            pagination.current = page; // set current page 


            if (search) {
                query = {
                    $or: [
                        { "name": { $regex: `${search}`, $options: 'i' } },
                        { "category": { $regex: `${search}`, $options: 'i' } },
                    ]
                }
                length = await model.find(query).countDocuments();
            }

            // search by category for blogs 
            if (category) {
                query = { category: { "$in": [category] } }
                length = await model.find(query).countDocuments();
            }

            // pagination.results = await model.find();
            pagination.results = await model.find(query).skip(startIndex).limit(endIndex);
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
            return;

        } catch (error) {
            res.status(500).json({ success: false, msg: "Internal Server Error", error: error.message })
        }
    }
}

module.exports = BlogsPagination;  
function BlogsPagination(model) {
    return async (req, res, next) => {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        let startIndex = (page - 1) * limit;
        let endIndex = (page) * limit;
        let category = req.query.productcategory;
        let subCategory = req.query.subcategory;
        let query = {};
        let maxValue = parseInt(req.query.max);
        let minValue = parseInt(req.query.min);
        if (!maxValue && !minValue) {
            // maxValue = 1000000;
            // minValue = 1;
        }
        if (minValue > maxValue) {
            let temp = maxValue;
            maxValue = minValue;
            minValue = temp;
        }
        let length;
        console.log(minValue, maxValue);
        try {
            // store results here 
            let pagination = {
                results: {},
                next: null,
                previous: null
            }

            pagination.length = length; // total num of items in the 
            pagination.current = page; // set current page 


            if (minValue && maxValue) {
                query = {
                    price: { $gte: minValue, $lte: maxValue },
                };
                if (req.query.productcategory) {
                    query = {
                        $and: [
                            { price: { $gte: minValue, $lte: maxValue } },
                            { category: { "$in": [req.query.productcategory] } },
                        ]
                    }
                }
            }

            // search by category for products
            if (category) {
                query = {
                    $or: [
                        // { category: { "$in": category } },
                        { "name": { $regex: `${category}` } },
                        // { price: { $gte: minValue, $lte: maxValue } },
                        // { subCategory: { "$in": [subCategory] } },
                    ]
                }
                length = await model.find(query).countDocuments();
            }
            // if (category) {
            //     query.$or = { category: { "$in": [category] } }
            // }
            // if (subCategory) {
            //     query.$or = { subCategory: { "$in": [subCategory] } };
            // }
            // if (minValue && maxValue) {
            //     query = { price: { $gte: minValue, $lte: maxValue } };
            // }

            length = await model.find(query).countDocuments() // length 

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
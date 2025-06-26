import express from 'express';
import protectRoute from '../middleware/auth.middleware.js';
import Category from '../models/Category.js';

const router = express.Router();

// POST /api/categories - Add new category (Private)
router.post('/', protectRoute, async (req, res) => {
    try {
        const { name, title, keywords, description } = req.body;
        // Validate required fields
        if (!name || !title) {
            return res.status(400).json({
                status: 400,
                message: "Name and Title are required"
            });
        }

        const category = new Category({
            name,
            title,
            keywords,
            description,
            userId: req.user._id // coming from protectRoute
        });

        await category.save();

        res.status(201).json({
            status: 201,
            message: "Category created successfully",
            data: category
        });

    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// POST /api/categories/search?start=0&recordSize=10&orderType=1&orderParam=createdAt
router.post('/search', protectRoute, async (req, res) => {
    try {
      const {
        start = 0,
        recordSize = 10,
        orderType = 1,
        orderParam = 'createdAt'
      } = req.query;
  
      const { search = '' } = req.body;
  
      const query = {
        userId: req.user._id,
        name: { $regex: search, $options: 'i' } // case-insensitive search
      };
  
      const totalRecords = await Category.countDocuments(query);
  
      const categories = await Category.find(query)
        .skip(parseInt(start))
        .limit(parseInt(recordSize))
        .sort({ [orderParam]: parseInt(orderType) });
  
      res.status(200).json({
        status: 200,
        message: "Categories fetched successfully",
        data: categories,
        pagination: {
          totalRecords,
          start: parseInt(start),
          recordSize: parseInt(recordSize),
          orderType: parseInt(orderType),
          orderParam
        }
      });
    } catch (error) {
      console.error("Error in category search:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error"
      });
    }
});
  
export default router;

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

        // 🔍 Check if category name already exists for the same user
        const existingCategory = await Category.findOne({ name: name.trim(), userId: req.user._id });
        if (existingCategory) {
            return res.status(409).json({
                status: 409,
                message: "Category name already exists"
            });
        }

        const category = new Category({
            name: name.trim(),
            title,
            keywords,
            description,
            userId: req.user._id
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

// PUT /api/categories/:categoryId - Update category (Private)
router.put('/:categoryId', protectRoute, async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, title, keywords, description } = req.body;

        // Check if category exists and belongs to the logged-in user
        const category = await Category.findOne({ _id: categoryId, userId: req.user._id });

        if (!category) {
            return res.status(404).json({
                status: 404,
                message: "Category not found"
            });
        }

        // Update only provided fields
        if (name !== undefined) category.name = name;
        if (title !== undefined) category.title = title;
        if (keywords !== undefined) category.keywords = keywords;
        if (description !== undefined) category.description = description;

        await category.save();

        res.status(200).json({
            status: 200,
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// DELETE /api/categories/:categoryId - Delete a category (Private)
router.delete('/:categoryId', protectRoute, async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Check if the category exists and belongs to the user
        const category = await Category.findOne({ _id: categoryId, userId: req.user._id });

        if (!category) {
            return res.status(404).json({
                status: 404,
                message: "Category not found or unauthorized"
            });
        }

        // Delete the category
        await Category.deleteOne({ _id: categoryId });

        res.status(200).json({
            status: 200,
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// GET /api/categories/list - Get all categories with id and name (Private)
router.get('/list', protectRoute, async (req, res) => {
    try {
      const categories = await Category.find({ userId: req.user._id }).select('_id name').sort({ name: 1 });
  
      res.status(200).json({
        status: 200,
        message: "Category list fetched successfully",
        data: categories
      });
    } catch (error) {
      console.error("Error fetching category list:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error"
      });
    }
  });

export default router;

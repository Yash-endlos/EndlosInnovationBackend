import express from 'express';
import protectRoute from '../middleware/auth.middleware.js';
import Blog from '../models/Blog.js';

const router = express.Router();

// POST /api/blogs - Create blog (Private)
router.post('/', protectRoute, async (req, res) => {
    try {
        const {
            title,
            categoryId,
            postedBy,
            blogContent,
            keywords,
            description
        } = req.body;

        // Validate all required fields
        if (!title || !categoryId || !postedBy || !blogContent || !keywords || !description) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required"
            });
        }

        // ✅ Check for existing blog with the same title by this user
        const existingBlog = await Blog.findOne({
            title: title.trim(),
            userId: req.user._id
        });

        if (existingBlog) {
            return res.status(409).json({
                status: 409,
                message: "Blog with this title already exists"
            });
        }

        const blog = new Blog({
            title: title.trim(),
            categoryId,
            postedBy,
            blogContent,
            keywords,
            description,
            postedOn: new Date(),
            userId: req.user._id
        });

        await blog.save();

        res.status(201).json({
            status: 201,
            message: "Blog created successfully",
            data: blog
        });

    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.post('/search', protectRoute, async (req, res) => {
    try {
        const {
            start = 0,
            recordSize = 10,
            orderType = 1,
            orderParam = 'createdAt'
        } = req.query;

        const { search = '' } = req.body;

        // Search on blog title (you can expand to other fields if needed)
        const query = {
            userId: req.user._id,
            title: { $regex: search, $options: 'i' } // case-insensitive search
        };

        const totalRecords = await Blog.countDocuments(query);

        const blogs = await Blog.find(query)
            .populate('categoryId', 'name') // fetch only the category name
            .skip(parseInt(start))
            .limit(parseInt(recordSize))
            .sort({ [orderParam]: parseInt(orderType) });

        res.status(200).json({
            status: 200,
            message: "Blogs fetched successfully",
            data: blogs,
            pagination: {
                totalRecords,
                start: parseInt(start),
                recordSize: parseInt(recordSize),
                orderType: parseInt(orderType),
                orderParam
            }
        });
    } catch (error) {
        console.error("Error in blog search:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// PUT /api/blogs/:blogId - Update blog (Private)
router.put('/:blogId', protectRoute, async (req, res) => {
    try {
        const { blogId } = req.params;
        const {
            title,
            categoryId,
            postedBy,
            blogContent,
            keywords,
            description
        } = req.body;

        // Check if blog exists and belongs to the user
        const blog = await Blog.findOne({ _id: blogId, userId: req.user._id });

        if (!blog) {
            return res.status(404).json({
                status: 404,
                message: "Blog not found or unauthorized"
            });
        }

        // If title is being updated, check for uniqueness
        if (title && title.trim() !== blog.title) {
            const existing = await Blog.findOne({
                title: title.trim(),
                userId: req.user._id,
                _id: { $ne: blogId } // exclude current blog
            });

            if (existing) {
                return res.status(409).json({
                    status: 409,
                    message: "Blog with this title already exists"
                });
            }

            blog.title = title.trim();
        }

        // Update other fields if present
        if (categoryId) blog.categoryId = categoryId;
        if (postedBy) blog.postedBy = postedBy;
        if (blogContent) blog.blogContent = blogContent;
        if (keywords) blog.keywords = keywords;
        if (description) blog.description = description;

        await blog.save();

        res.status(200).json({
            status: 200,
            message: "Blog updated successfully",
            data: blog
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// DELETE /api/blogs/:blogId - Delete blog (Private)
router.delete('/:blogId', protectRoute, async (req, res) => {
    try {
        const { blogId } = req.params;

        // Check if the blog exists and belongs to the user
        const blog = await Blog.findOne({ _id: blogId, userId: req.user._id });

        if (!blog) {
            return res.status(404).json({
                status: 404,
                message: "Blog not found or unauthorized"
            });
        }

        // Delete the blog
        await Blog.deleteOne({ _id: blogId });

        res.status(200).json({
            status: 200,
            message: "Blog deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});


export default router;

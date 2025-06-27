import mongoose from 'mongoose';
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  postedBy: {
    type: String,
    required: true
  },
  postedOn: {
    type: Date,
    required: true,
    default: Date.now
  },
  blogContent: {
    type: String,
    required: true
  },
  keywords: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;

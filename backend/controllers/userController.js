// backend/controllers/userController.js
const User = require('../models/User');
const Post = require('../models/Post');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const posts = await Post.find({ author: req.user.id });
    const readPosts = user.readPosts || [];

    res.status(200).json({
      user,
      posts,
      readPosts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markPostAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user.readPosts.includes(postId)) {
      user.readPosts.push(postId);
      await user.save();
    }

    res.status(200).json({ message: 'Post marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReadPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('readPosts');

    res.status(200).json(user.readPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserPostCount = async (req, res) => {
    try {
        const postCount = await Post.countDocuments({ author: req.user.id }); // Count posts
        res.status(200).json({ postCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post count' });
    }
};

module.exports = {
  getUserProfile,
  markPostAsRead,
  getReadPosts,
  getUserPostCount,
};

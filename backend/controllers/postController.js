// backend/controllers/postController.js
const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({
      title,
      content,
      author: req.user._id,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// getting posts & paginating them, & the functonality to search posts
const getPosts = async (req, res) => {
  try {
	  const { page = 1, limit = 10, search = '' } = req.query;

	  const query = search ? { $text: { $search: search } } : {};

	  const posts = await Post.find(query)
		  .populate('author', 'username')
	  .limit(limit * 1)
	  .skip((page - 1) * limit)
	  .exec();

	  const count = await Post.countDocuments(query);

	  res.status(200).json({
		  posts,
		  totalPages: Math.ceil(count / limit),
		  currentPage: page,
	  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};

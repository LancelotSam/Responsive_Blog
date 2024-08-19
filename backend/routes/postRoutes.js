// backend/routes/postRoutes.js
const express = require('express');
const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Post = require('../models/Post');

const router = express.Router();

router.post('/', authMiddleware, upload.single('headerImage'), async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title || 'Untitled',
            content: req.body.content || 'No content provided',
            author: req.user.id,
            headerImage: req.file ? `/uploads/${req.file.filename}` : null,
        });

        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

router.post('/upload', authMiddleware, upload.single('headerImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;

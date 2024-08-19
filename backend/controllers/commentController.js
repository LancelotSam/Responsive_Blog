// backend/controllers/commentController.js
const Comment = require('../models/Comment');
const mongoose = require('mongoose'); // Make sure to require mongoose

const createComment = async (req, res) => {
    try {
        const { content, postId } = req.body;

        // Validate if postId is provided and is a valid ObjectId
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: 'Invalid or missing postId' });
        }

        const comment = new Comment({
            content,
            author: req.user.id,
            post: postId,
        });

        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createComment,
    getComments,
};

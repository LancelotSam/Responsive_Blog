const express = require('express');
const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Post = require('../models/Post');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing blog posts
 */

/**
 * @swagger
 * /posts/:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the blog post
 *                 example: "My First Blog Post"
 *               content:
 *                 type: string
 *                 description: Content of the blog post
 *                 example: "This is the content of my first blog post."
 *               headerImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional header image for the post
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post created successfully"
 *                 post:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "66c8614bdde4c9f746eeed4b"
 *                     title:
 *                       type: string
 *                       example: "My First Blog Post"
 *                     content:
 *                       type: string
 *                       example: "This is the content of my first blog post."
 *                     author:
 *                       type: string
 *                       example: "66c690129ad1e73368074107"
 *                     headerImage:
 *                       type: string
 *                       example: "/uploads/1724408139576-Screenshot.png"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-08-23T10:15:39.616Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Bad request, validation error
 *       401:
 *         description: Unauthorized, authentication required
 *       500:
 *         description: Failed to create post
 */
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

/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Update an existing blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the post
 *               content:
 *                 type: string
 *                 description: Updated content of the post
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post updated successfully
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       403:
 *         description: Unauthorized to update this post
 *       500:
 *         description: Server error
 */
router.put('/:postId', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, content } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to update this post' });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        await post.save();

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});

/**
 * @swagger
 * /posts/image/{postId}:
 *   put:
 *     summary: Update header image of an existing post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog post to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               headerImage:
 *                 type: string
 *                 format: binary
 *                 description: The new header image to upload
 *     responses:
 *       200:
 *         description: Image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image updated successfully
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Failed to update image
 */
router.put('/image/:id', authMiddleware, upload.single('headerImage'), async (req, res) => {
    try {
        console.log('File received:', req.file);

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.headerImage = req.file ? `/uploads/${req.file.filename}` : post.headerImage;

        await post.save();

        res.status(200).json({ message: 'Image updated successfully', post });
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ error: 'Failed to update image' });
    }
});

/**
 * @swagger
 * /posts/user/{userId}:
 *   get:
 *     summary: Get all posts created by a specific user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose posts you want to retrieve
 *     responses:
 *       200:
 *         description: List of posts created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       404:
 *         description: No posts found for this user
 *       500:
 *         description: Failed to fetch posts
 */
router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        const posts = await Post.find({ author: userId }).populate('author', 'username email');

        if (!posts || posts.length === 0) {
            return res.status(404).json({ error: 'No posts found for this user' });
        }

        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post deleted successfully
 *       404:
 *         description: Post not found
 *       403:
 *         description: Unauthorized to delete this post
 *       500:
 *         description: Server error
 */
router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this post' });
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

module.exports = router;
// backend/routes/userRoutes.js
const express = require('express');
const { getUserProfile, markPostAsRead, getReadPosts, getUserPostCount } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Ensure authMiddleware is used for authentication, replacing 'protect'
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user-related operations
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access
 */
router.get('/profile', getUserProfile);

/**
 * @swagger
 * /users/read/{postId}:
 *   post:
 *     summary: Mark a post as read for the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters: 
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to mark as read
 *     responses:
 *       200:
 *         description: Post marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post marked as read
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post('/read/:postId', markPostAsRead);

/**
 * @swagger
 * /users/read:
 *   get:
 *     summary: Get a list of posts read by the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved read posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized access
 */
router.get('/read', getReadPosts);

/**
 * @swagger
 * /users/postcount:
 *   get:
 *     summary: Get the count of posts made by the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the post count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postCount:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Failed to fetch post count
 */
router.get('/postcount', getUserPostCount);

module.exports = router;
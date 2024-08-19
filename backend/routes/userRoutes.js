// backend/routes/userRoutes.js
const express = require('express');
const { getUserProfile, markPostAsRead, getReadPosts  } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// make sure auhmiddleware is used for authentication, in place of 'protect'
router.use(authMiddleware);

router.get('/profile', getUserProfile);
router.post('/read/:postId', markPostAsRead);
router.get('/read', getReadPosts);

module.exports = router;

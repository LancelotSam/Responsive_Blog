// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const setupSwaggerDocs = require('./swagger');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',  // Allow only this origin
  methods: 'GET,POST,PUT,DELETE',    // Allow specific HTTP methods
}));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/image', postRoutes)

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.send('Backend Blog Post API is running...');
});

setupSwaggerDocs(app, PORT); // Initialize Swagger docs

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { app, server };

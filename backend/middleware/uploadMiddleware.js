// backend/middleware/uploadMiddleware.js
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// checking if upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, {recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));  // Absolute path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});


const upload = multer({ storage: storage });

module.exports = upload;

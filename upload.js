const multer = require("multer");
const path = require("path");

// Set up multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;

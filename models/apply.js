// const { google } = require("googleapis");
// const path = require("path");
// const multer = require("multer");
// const mongoose = require("mongoose");
// const { PassThrough } = require("stream");

// // Load Google Service Account credentials
// const KEYFILEPATH = path.join(__dirname, "hiresphere-434209-ac04b94e89fd.json"); // Replace with your service account credentials file
// const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// const auth = new google.auth.GoogleAuth({
//   keyFile: KEYFILEPATH,
//   scopes: SCOPES,
// });

// const drive = google.drive({ version: "v3", auth });

// // Set up multer to handle file uploads in memory
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const applySchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   resume: { type: String, required: false }, // Store Google Drive file ID
//   cover_letter: String,
// });

// const Apply = mongoose.model("Apply", applySchema);

// // Function to upload file to Google Drive
// async function uploadToGoogleDrive(file) {
//   const fileMetadata = {
//     name: Date.now() + path.extname(file.originalname),
//     parents: ["1VQ5lkdmV27eoOOoD0FgsxfjDmbu_LAEV"], // Replace with your Google Drive folder ID
//   };
//   // console.log("Uploading to Google Drive with metadata:", fileMetadata);

//   const media = {
//     mimeType: file.mimetype,
//     body: new PassThrough().end(file.buffer), // Convert buffer to readable stream
//   };

//   const response = await drive.files.create({
//     resource: fileMetadata,
//     media: media,
//     fields: "id",
//   });

//   return response.data.id;
// }

// // Upload file to Google Drive and save info to MongoDB
// async function handleFileUpload(req, res) {
//   // console.log("Uploaded file:", req.file);
//   try {
//     const file = req.file;
//     const driveFileId = await uploadToGoogleDrive(file);

//     // Save to MongoDB
//     const application = new Apply({
//       name: req.body.name,
//       email: req.body.email,
//       resume: driveFileId, // Save Google Drive file ID
//       cover_letter: req.body.coverLetter,
//     });

//     await application.save();

//     res.status(200).send("Application submitted successfully!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred during the upload.");
//   }
// }

// module.exports = { Apply, upload, handleFileUpload };
require("dotenv").config();

const { google } = require("googleapis");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const { PassThrough } = require("stream");

// Load Google Service Account credentials from environment variable
const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
const credentials = JSON.parse(credentialsJson);

// Configure Google Auth
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

// Set up multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const applySchema = new mongoose.Schema({
  name: String,
  email: String,
  resume: { type: String, required: false }, // Store Google Drive file ID
  cover_letter: String,
});

const Apply = mongoose.model("Apply", applySchema);

// Function to upload file to Google Drive
async function uploadToGoogleDrive(file) {
  const fileMetadata = {
    name: Date.now() + path.extname(file.originalname),
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Replace with your Google Drive folder ID from environment variable
  };

  const media = {
    mimeType: file.mimetype,
    body: new PassThrough().end(file.buffer), // Convert buffer to readable stream
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id",
  });

  return response.data.id;
}

// Upload file to Google Drive and save info to MongoDB
async function handleFileUpload(req, res) {
  try {
    const file = req.file;
    const driveFileId = await uploadToGoogleDrive(file);

    // Save to MongoDB
    const application = new Apply({
      name: req.body.name,
      email: req.body.email,
      resume: driveFileId, // Save Google Drive file ID
      cover_letter: req.body.coverLetter,
    });

    await application.save();

    res.status(200).send("Application submitted successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during the upload.");
  }
}

module.exports = { Apply, upload, handleFileUpload };

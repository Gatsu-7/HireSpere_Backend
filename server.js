require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const upload = require("./upload"); // Import the upload middleware
const { handleFileUpload } = require("./models/apply"); // Ensure handleFileUpload is correctly exported
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");

app.post("/api/apply", upload.single("resume"), handleFileUpload);

app.use("/api", registerRoute);
app.use("/api", loginRoute);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

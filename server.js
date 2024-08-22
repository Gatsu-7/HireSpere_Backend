const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
require("./config/database").connect();

const user = require("./routes/user");
app.use("/api/v1", user);

app
  .listen(PORT, (err) => {
    if (err) {
      console.error(`Failed to start server: ${err.message}`);
      process.exit(1);
    }
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error(`Server error: ${err.message}`);
  });

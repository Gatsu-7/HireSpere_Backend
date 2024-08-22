const express = require("express");
const router = express.Router();

const { login, signup } = require("../controllers/Auth");
const { auth, isJobSeeker, isAdmin } = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);

router.get("/test", auth, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the testing route.",
  });
});

router.get("/jobseeker", auth, isJobSeeker, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to The Protected Route for Students.",
  });
});

router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to The Protected Route for Admin.",
  });
});

module.exports = router;

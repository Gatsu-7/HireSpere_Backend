const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Assuming you have a User model
const bcrypt = require("bcryptjs"); // or 'bcrypt'
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user by email
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Credentials" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Credentials" });
      }

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign the token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" }, // Adjust expiration time as needed
        (err, token) => {
          if (err) throw err;
          res.json({ success: true, token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

module.exports = router;

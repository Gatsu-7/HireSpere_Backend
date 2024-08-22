const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    //extract jwt token
    // pending:other ways to fetch tokens.
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }
    // verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);

      req.user = decode;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Something Went Wrong, while verifying the token",
    });
  }
};

exports.isJobSeeker = (req, res, next) => {
  try {
    if (req.user.role != "Job Seeker") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected route for Students, You're not allowed.",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, while checking if the user is Student.",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role != "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected route for Admin, You're not allowed.",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, while checking if the user is Admin.",
    });
  }
};

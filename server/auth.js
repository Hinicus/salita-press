const jwt = require("jsonwebtoken");
require("dotenv").config();

//create token
module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(data, process.env.JWT_SECRET, {});
};

//verify token
module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.send({ auth: "Failed. No token provided" });
  } else {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).send({
        auth: "Failed",
        messsage: err.message,
      });
    } else {
      req.user = decodedToken;
      next();
    }
  });
};

//verify admin
module.exports.verifyAdmin = (req, res, next) => {
  // check if the user is admin
  if (!req.user.isAdmin) {
    return res.status(403).send({ auth: "Unauthorized User" });
  }
  next();
};

//Error handling
module.exports.errorHandler = (err, req, res, next) => {
  // Error logging
  console.error(err);

  const statusCode = err.statusCode || 500;

  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      errorCode: err.code || "SERVER_ERROR",
      details: err.details || null,
    },
  });
};

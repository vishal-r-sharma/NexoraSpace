const jwt = require("jsonwebtoken");

const generateToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "30d", // token expires in 30 days
  });
};

module.exports = generateToken;

const express = require("express");
const router = express.Router();
const {login, logout, registerSystem} = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")


router.post("/register", registerSystem)
router.post("/login", login)
router.post("/logout", logout)
router.get("/check", authMiddleware, (req, res) => {
  // middleware has attached req.user
  res.status(200).json({ authenticated: true, user: req.user });
});

module.exports = router;
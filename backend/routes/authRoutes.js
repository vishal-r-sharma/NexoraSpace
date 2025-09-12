const express = require("express");
const router = express.Router();
const {login, logout, registerSystem} = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")


router.post("/register", registerSystem)
router.post("/login", login)
router.post("/logout", logout)

// protected check route — middleware attaches req.user
router.get("/check", authMiddleware, (req, res) => {
  return res.status(200).json({ authenticated: true, user: req.user });
});

module.exports = router;
const express = require("express");
const {
  registerController,
  authenticateController,
  generateOTPController,
} = require("./controller");

const router = express.Router();

router.post("/register", registerController);
router.get("/generate-otp", generateOTPController);
router.post("/authenticate", authenticateController);

module.exports = router;

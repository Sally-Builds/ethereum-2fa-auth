const { registerUser, generateOTP, authenticate } = require("./service");

const registerController = async (req, res, next) => {
  const { username, otp_seed } = req.body;
  try {
    const data = await registerUser(username, otp_seed);

    return res.status(201).json({
      msg: "User Registration Successful",
      hash: data,
      data: {},
    });
  } catch (e) {
    return res.status(400).json({
      error: e.message,
      data: {},
    });
  }
};

const generateOTPController = async (req, res, next) => {
  try {
    const otp = await generateOTP();

    return res.status(200).json({
      msg: "OTP Generated",
      data: otp,
    });
  } catch (e) {
    return res.status(400).json({
      error: e,
      data: {},
    });
  }
};

const authenticateController = async (req, res, next) => {
  try {
    const otp = await authenticate(req.body.otp);

    return res.status(200).json({
      msg: "OTP successful",
      hash: data,
      data: { otp },
    });
  } catch (e) {
    return res.status(400).json({
      error: e,
      data: {},
    });
  }
};

module.exports = {
  registerController,
  generateOTPController,
  authenticateController,
};

import express from "express";
import { signup, login, logout, checkAuth, googleAuth, googleAuthCallback, forgotPassword, getTime, verifyOtp, updatePassword, validateResetToken, verifyEmail } from "../../controllers/auth/auth.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { verifyResetToken } from "../../middleware/reset.middleware.js";
import { generateAuthToken } from "../../utils/generatetoken.util.js";

const router = express.Router();

router.post('/signup', signup);

router.post('/email/verify', verifyEmail);

router.post('/login', login);

router.post('/logout', logout);

router.get('/check', protectRoute, checkAuth);

router.get('/google', googleAuth);

router.get('/google/callback', (req, res, next) => {
  console.log("Callback query params:", req.query); // should contain "code"
  next();
}, googleAuthCallback, async (req, res) => {
    const user = req.user;

    generateAuthToken(user._id, res);

    if(user?.role === 'admin') {
      res.redirect(process.env.CLIENT_URL + '/admin');
    }
    if(user?.role === 'user') {
      res.redirect(process.env.CLIENT_URL + '/shop');
    }
});

router.post('/password/forgot', forgotPassword);

router.post('/otp/time', getTime);

router.post('/otp/verify', verifyOtp);

router.put('/password/update', verifyResetToken, updatePassword);

router.get('/validate-reset-token', validateResetToken);

export default router;
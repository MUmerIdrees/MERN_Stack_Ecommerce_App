import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateAuthToken, generateResetToken } from "../../utils/generatetoken.util.js";
import passport from "passport";
import { sendEmail } from "../../utils/sendMail.util.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password must be atleast 6 characters"});
        }

        const user = await User.findOne({ email });

        if(user && user.isVerified) {
            return res.status(400).json({message: "User already exists and verified"});
        }

        const otp = Math.floor(Math.random() * 900000) + 100000;
        const otpExpireAt = new Date().getTime() + 2 * 60 * 1000

        if(user && !user.isVerified) {
            user.verification_otp.otp = otp;
            user.verification_otp.otp_expire_at = otpExpireAt;
            await user.save();
            const stringOtp = otp.toString();
            await sendEmail({
                email: user.email,
                subject: "Email Verification OTP",
                text: `Your OTP for email verification is ${stringOtp}. Use this OTP to proceed with email verification.`
            });

            return res.status(200).json({ message: 'OTP resent. Please verify your email.' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User ({
            fullName,
            email,
            password: hashedPassword,
            verification_otp: {
                otp,
                otp_expire_at: otpExpireAt,
            }
        });
        await newUser.save();

        const stringOtp = otp.toString();

        await sendEmail({
            email: newUser.email,
            subject: "Email Verification OTP",
            text: `Your OTP for email verification is ${stringOtp}. Use this OTP to proceed with email verification.`
        });

        res.status(201).json({ message: 'Signup successful, please verify your email with OTP.' });

    } catch (error) {
        console.log("Error in signup controller ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const verifyEmail = async (req, res) => {
    const { otp } = req.body;

    try {
        const user = await User.findOne({ 'verification_otp.otp': otp });

        if(!user) {
            return res.status(400).json({message: "Incorrect Otp"});
        }

        const isExpire = user.verification_otp.otp_expire_at < new Date().getTime();

        if(isExpire) {
            return res.status(400).json({message: "Otp expired"});
        }

        user.isVerified = true;
        user.verification_otp.otp = null;

        // Generate JWT Token
        generateAuthToken(user._id, res);

        await user.save();

        res.status(200).json(
            {
                message: "Email verified successfully!",
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                }
            }
        );

    } catch (error) {
        console.log("Error in verify email controller ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        if(user && !user.isVerified) {
            return res.status(400).json({message: "User not verified, please verify your email."});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        generateAuthToken(user._id, res);

        res.status(200).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.log("Error in login controller ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("auth_token", "", {maxAge: 0});
        res.status(200).json({message: "Logout Successfully"});
    } catch (error) {
        console.log("Error in logout controller ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const googleAuth = (req, res, next) => {
    const from = req.query.from || '/shop/home';

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: from,
        session: false,
    })(req, res, next);
};

export const googleAuthCallback = passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.CLIENT_URL + '/login'
});

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if(!email) {
            return res.status(400).json({message: "Email is required"});
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({message: "User not found"});
        }

        const userOtp = user.password_otp?.otp;

        if(userOtp) {
            const timeDiff = new Date().getTime() - new Date(user.password_otp.last_attempt).getTime() <= 24 * 60 * 60 * 1000;

            if(!timeDiff) {
                user.password_otp.limit = 5;
                await user.save();
            }

            const remainLimit = user.password_otp.limit === 0;

            if(timeDiff && remainLimit) {
                return res.status(400).json({message: "Daily limit reached"});
            }
        }

        const otp = Math.floor(Math.random() * 900000) + 100000;
        user.password_otp.otp = otp;
        user.password_otp.limit--;
        user.password_otp.last_attempt = new Date();
        user.password_otp.otp_expire_at = new Date().getTime() + 2 * 60 * 1000;
        await user.save();

        const stringOtp = otp.toString();

        const data = {
            email: email,
            subject: "Password Reset OTP",
            text: `Your OTP for resetting password is ${stringOtp}. Use this OTP to proceed with resetting your password.`,
        };

        await sendEmail(data);
        
        res.status(200).json({
            message: `otp sent at ${email}`,
            status: true,
            otp: user.password_otp.otp,
        });
    } catch (error) {
        console.log("Error in fogot password controller ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const getTime = async (req, res) => {
    const { email, type } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({message: "Something went wrong"});
        }

        let time;
        if(type === "reset") {
            time = user.password_otp.otp_expire_at;
        } else {
            time = user.verification_otp.otp_expire_at;
        }
        res.status(200).json({ time });
    } catch (error) {
        console.log("Error in get time controller ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const verifyOtp = async (req, res) => {
    const { otp } = req.body;

    try {
        const user = await User.findOne({ 'password_otp.otp': otp });

        if(!user) {
            return res.status(400).json({message: "Incorrect Otp"});
        }

        const isExpire = user.password_otp.otp_expire_at < new Date().getTime();

        if(isExpire) {
            return res.status(400).json({message: "Otp expired"});
        }

        user.password_otp.otp = null;
        await user.save();

        generateResetToken(user.email, res);

        res.status(200).json({message: "Otp verified"});

    } catch (error) {
        console.log("Error in verify otp controller ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const updatePassword = async (req, res) => {
    const { password } = req.body;
    if(!password) {
        return res.status(400).json({message: "Password is required"});
    }

    try {
        const user = await User.findOne({ email: req.email });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();
        res.clearCookie('reset_token');

        res.status(200).json({message: "Password updated successfully"});
        
    } catch (error) {
        console.log("Error in update password controller ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const validateResetToken = async (req, res) => {
    const token = req.cookies.reset_token;
    if(!token) {
        return res.status(400).json({message: 'No token'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(400).json({message: "Invalid or expire token"});
        }
        res.status(200).json({message: "Valid"});

    } catch (error) {
        console.log("Error in validate reset token controller ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};
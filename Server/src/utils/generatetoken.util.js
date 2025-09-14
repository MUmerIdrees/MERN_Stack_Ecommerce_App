import jwt from "jsonwebtoken";

export const generateAuthToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("auth_token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //MS
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
        secure: process.env.NODE_ENV === "production", // allow non-https locally 
    });
};

export const generateResetToken = (email, res) => {
    const token = jwt.sign({email}, process.env.JWT_SECRET, {
        expiresIn: "10m"
    });

    res.cookie("reset_token", token, {
        maxAge: 10 * 60 * 1000, //MS
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
        secure: process.env.NODE_ENV === "production", // allow non-https locally 
    });
};

import jwt from 'jsonwebtoken';

export const verifyResetToken = async (req, res, next) => {
    try {
        const token = req.cookies.reset_token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        req.email = decoded.email;
        next();

    } catch (error) {
        console.error('Error in resetVerifyToken middleware:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
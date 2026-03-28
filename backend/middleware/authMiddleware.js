import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1];
            
            console.log("Verifying token:", token);
            console.log("JWT_SECRET:", process.env.JWT_SECRET ? "exists" : "missing");
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            console.log("User found:", req.user ? "yes" : "no");

            next();

        } catch (error) {
            console.error("JWT verification error:", error);
            return res.status(401).json({message: "Not authorized, token failed"});
        }

    }
    if (!token) {
        return res.status(401).json({message: "Not authorized, no token"});
    }
};


import jwt from 'jsonwebtoken';
import { user } from '../models/user.model.js';
export const verifyToken = async (req, res, next) => {
    
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    // console.log('Token found:', token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        req.user = await user.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

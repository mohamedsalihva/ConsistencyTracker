import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware =(req: any, res: Response, next: NextFunction) =>{
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        req.user=decoded;
        
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}

export default authMiddleware;
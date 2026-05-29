import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";


export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Missing or invalid authorization header" });
  }

  try {
    const jwtsecret = process.env.JWT_SECRET;
    if (!jwtsecret) {
      throw new Error("JWT secret required ");
    }

    type AuthTokenPayload = {
      userId: string;
    };

    const decoded = jwt.verify(token, jwtsecret) as AuthTokenPayload;
    if(!decoded.userId){
        return res.status(401).json({ message: "Invalid token payload"});
    }
    req.userId = decoded.userId;
    next();
    
  } catch (err) {
    if (err instanceof Error && err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access Token Expired" });
    }
    return res.status(401).json({ message: "invalid token" });
  }
}

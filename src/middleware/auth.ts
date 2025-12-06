import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";

import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";

//* roles is array of string like ['admin', 'customer']
export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers.authorization;

      if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Invalid token",
        });
      }

      const [, token]: string[] = authorization?.split(" ");
      if (!token) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Token not found",
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload;

      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: "unauthorized!!!",
        });
      }

      next()
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  };
};

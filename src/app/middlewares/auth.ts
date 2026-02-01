import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../errors/ApiError";
import { jwtHelper } from "../helper/jwtHealper";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const verifyUser = jwtHelper.verifyToken(
        token,
        process.env.JWT_SECRET as string,
      );

      req.user = verifyUser;

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "You are not authorized to access this route",
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;

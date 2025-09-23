import type { RequestHandler, Request, Response, NextFunction } from "express";
import AppAssert from "../util/AppAssert.js";
import { UNAUTHORIZED } from "../constants/http.js";
import { verifyToken } from "../util/jwt.js";
import AppErrorCode from "../constants/appErrorCode.js";

const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {

    const accessToken = req.cookies.accessToken as string | undefined;

    AppAssert(accessToken, UNAUTHORIZED, "Unauthorized");

    const { error, payload } = verifyToken(accessToken);

    AppAssert(payload, UNAUTHORIZED, error === "jwt expired" ? "Token expired" : "Invalid token", AppErrorCode.InvalidAccessToken);

    req.userId = payload.userId;
    req.sessionId = payload.sessionId;
    next();

};

export default authenticate;
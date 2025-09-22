import { Router } from "express";
import {
    loginHandler,
    logoutHandler,
    refreshTokenHandler,
    registerHandler,
    verifyEmailHandler,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/refresh", refreshTokenHandler);
authRouter.get("/logout", logoutHandler);
authRouter.get("/email/verify/:code", verifyEmailHandler);

export default authRouter;
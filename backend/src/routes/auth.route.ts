import { Router } from "express";
import {
    loginHandler,
    logoutHandler,
    refreshTokenHandler,
    registerHandler,
    resetPasswordHandler,
    sendPasswordResetHandler,
    verifyEmailHandler,
} from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/refresh", refreshTokenHandler);
authRouter.get("/logout", logoutHandler);
authRouter.get("/email/verify/:code", verifyEmailHandler);
authRouter.post("/password/forget", sendPasswordResetHandler);
authRouter.post("/password/reset", resetPasswordHandler);

export default authRouter;
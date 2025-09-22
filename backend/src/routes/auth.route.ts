import { Router } from "express";
import {
    loginHandler,
    registerHandler,
    verifyEmailHandler,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/email/verify/:code", verifyEmailHandler);

export default authRouter;
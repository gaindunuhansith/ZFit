import { Router } from "express";
import {
    loginHandler,
    registerHandler,
    verifyEmailHandler,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);


export default authRouter;
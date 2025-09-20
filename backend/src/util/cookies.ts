import type { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date.util.js";
import { NODE_ENV } from "../config/env.js";

export const REFRESH_PATH = "api/v1/auth/refresh";
const secure = NODE_ENV !== "development";

const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: fifteenMinutesFromNow(),
});

export const getRefreshCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: thirtyDaysFromNow(),
    path: REFRESH_PATH,
});

type Params = {
    res: Response;
    accessToken: string;
    refre
}
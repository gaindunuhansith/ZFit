import assert from "node:assert";
import AppError from "./AppError.js"
import type { HttpStatusCode } from "../constants/http.js"
import AppErrorCode from "../constants/appErrorCode.js";


type AppAssert = (
    condition: any,
    httpStatusCode: HttpStatusCode,
    message: string,
    appErrorCode?: AppErrorCode
) => asserts condition;

const AppAssert: AppAssert = (
    condition,
    httpStatusCode,
    message,
    appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default AppAssert;
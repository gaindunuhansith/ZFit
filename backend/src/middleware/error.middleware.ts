import type { Request, Response, NextFunction } from "express";

//customer error interface 
interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    errors?: Record<string, { message: string }>;
    name: string;
}

//error handling middleware function
const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    try {
        let error = { ...err };

        error.message = err.message;
        
        console.error(err);

        //Mongoose bad ObjectId
        if(err.name === 'CastError'){
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        //Mongoose duplicate key
        if(err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        //Mongoose validation error
        if(err.name === 'ValidationError'){
            const message = err.errors ? Object.values(err.errors).map(val => val.message) : ['Validation error'];
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error'});

    } catch (error) {
        next(error);
    }
}


export default errorMiddleware;
import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

/**
 * Validate the request and return the error as a response
 * @param req The request
 * @param res The response
 * @param next The next middleware to be handled
 * @returns {object} The response object (either an error or the next middleware)
 */
export const validate = (req: Request, res: Response, next: NextFunction): object | void => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors: { [x: number]: any; }[] = [];
    errors.array().map((err) => extractedErrors.push({ [err.type]: err.msg }));

    return res.status(400).json({
        errors: extractedErrors,
    });
};

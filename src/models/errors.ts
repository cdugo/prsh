/* eslint-disable max-classes-per-file */

import { Prisma } from '@prisma/client';

export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = new.target.name; // Automatically set the error name to the class name
        Object.setPrototypeOf(this, new.target.prototype); // Ensure instanceof checks work

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, new.target); // Improve stack trace by omitting this constructor
        }
    }
}

export class NotFoundError extends CustomError {
    statusCode: number;

    constructor(msg: string) {
        super(msg);
        this.name = 'NotFoundError';
        this.message = msg;
        this.statusCode = 404;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends CustomError {
    statusCode: number;

    constructor(msg: string) {
        super(msg);
        this.name = 'BadRequestError';
        this.message = msg;
        this.statusCode = 400;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class UnknownError extends CustomError {
    statusCode: number;

    constructor(msg: string) {
        super(msg);
        this.name = 'UnknownError';
        this.message = msg;
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class UnprocessableEntityError extends CustomError {
    statusCode: number;

    constructor(msg: string) {
        super(msg);
        this.name = 'UnprocessableEntityError';
        this.message = msg;
        this.statusCode = 422;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Checks if an error is a PrismaClientKnownRequestError and has the target field
 * @param error - The error to check
 * @returns True if the error is a PrismaClientKnownRequestError and has the target field
 * */
export function isErrorWithTarget(error: unknown): error is Prisma.PrismaClientKnownRequestError & { meta: { target: string[] } } {
    return error instanceof Prisma.PrismaClientKnownRequestError
         && typeof (error as any).meta === 'object'
         && Array.isArray((error as any).meta.target);
}

/**
 * Converts Prisma errors to custom application errors based on the error code.
 * @param error The PrismaClientKnownRequestError to convert.
 * @throws {CustomError} The corresponding custom error for the Prisma error.
 */
export function handleDatabaseError(error: Prisma.PrismaClientKnownRequestError): never {
    if (!isErrorWithTarget(error)) throw new UnknownError('An unexpected database error occurred');
    switch (error.code) {
    case 'P2002': {
        const target = error.meta?.target?.join(', ');
        throw new BadRequestError(`${target} already exists`);
    }
    default:
        throw new UnknownError('An unexpected database error occurred');
    }
}

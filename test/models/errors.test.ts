import { Prisma } from '@prisma/client';
import {
    NotFoundError,
    BadRequestError,
    UnknownError,
    UnprocessableEntityError,
    isErrorWithTarget,
    handleDatabaseError,
} from '../../src/models/errors';

describe('CustomError classes', () => {
    it('NotFoundError should have status code 404', () => {
        const error = new NotFoundError('Not Found');
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('Not Found');
    });

    it('BadRequestError should have status code 400', () => {
        const error = new BadRequestError('Bad Request');
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Bad Request');
    });

    it('UnknownError should have status code 500', () => {
        const error = new UnknownError('Unknown Error');
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe('Unknown Error');
    });

    it('UnprocessableEntityError should have status code 422', () => {
        const error = new UnprocessableEntityError('Unprocessable Entity');
        expect(error.statusCode).toBe(422);
        expect(error.message).toBe('Unprocessable Entity');
    });
});

describe('isErrorWithTarget function', () => {
    it('should return true for PrismaClientKnownRequestError with target', () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            'Error with target',
            {
                code: 'P2002',
                clientVersion: '2.29.1',
                meta: { target: ['email'] },
            },
        );
        expect(isErrorWithTarget(error)).toBe(true);
    });

    it('should return false for errors without target', () => {
        const error = new Error('Regular Error');
        expect(isErrorWithTarget(error)).toBe(false);
    });
});

describe('handleDatabaseError function', () => {
    it('should throw BadRequestError for P2002', () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            'Error with target',
            {
                code: 'P2002',
                clientVersion: '2.29.1',
                meta: { target: ['email'] },
            },
        );
        expect(() => handleDatabaseError(error)).toThrow(BadRequestError);
    });

    it('should throw NotFoundError for P2025', () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            'Error with target',
            {
                code: 'P2025',
                clientVersion: '2.29.1',
                meta: { target: ['user'] },
            },
        );
        expect(() => handleDatabaseError(error)).toThrow(NotFoundError);
    });

    it('should throw UnknownError for any other error code', () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            'An unexpected error occurred',
            {
                code: 'P9999',
                clientVersion: '2.29.1',
                // No need for meta in this case, as it's testing the default error handling
            },
        );
        expect(() => handleDatabaseError(error)).toThrow(UnknownError);
    });
});

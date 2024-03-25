import { Beast, Prisma } from '@prisma/client';
import BeastModel from '../../src/models/beast';
import prisma from '../../src/db/init';
import {
    NotFoundError, UnknownError, UnprocessableEntityError,
} from '../../src/models/errors';

// Mock the prisma client operations
jest.mock('../../src/db/init', () => ({
    beast: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    },
}));

// This allows us to keep the original functionality of the custom errors but still spy on them.
// jest.mock('../../src/models/errors', () => ({
//     ...jest.requireActual('../../src/models/errors'),
//     NotFoundError: jest.fn(),
//     UnknownError: jest.fn(),
//     UnprocessableEntityError: jest.fn(),
//     handleDatabaseError: jest.fn(),
//     isErrorWithTarget: jest.fn().mockReturnValue(false),
// }));

describe('BeastModel', () => {
    const mockBeastData: Beast = {
        id: 1, gamerTag: 'testGamer', email: 'test@test.com', createdAt: new Date(), updatedAt: new Date(),
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('create method', () => {
        it('should create a new beast successfully', async () => {
            (prisma.beast.create as jest.Mock).mockResolvedValue(mockBeastData);

            const result = await BeastModel.create('testGamer', 'test@test.com');
            expect(result).toEqual(mockBeastData);
            expect(prisma.beast.create).toHaveBeenCalledWith({
                data: {
                    gamerTag: 'testGamer',
                    email: 'test@test.com',
                },
            });
        });

        it('should throw UnknownError when an unexpected error occurs', async () => {
            jest.mocked(prisma.beast.create).mockRejectedValue(new Error());

            await expect(BeastModel.create('testGamer', 'test@test.com')).rejects.toThrow(UnknownError);
        });

        // Test for PrismaClientKnownRequestError with a target field (e.g., duplicate email or gamerTag)
        it('should handle PrismaClientKnownRequestError with target field', async () => {
            const prismaError = new Prisma.PrismaClientKnownRequestError(
                'Duplicate field',
                {
                    code: 'P2002',
                    clientVersion: '2.29.1',
                    meta: { target: ['email'] },
                },
            );
            jest.mocked(prisma.beast.create).mockRejectedValue(prismaError);

            await expect(BeastModel.create('testGamer', 'test@test.com')).rejects.toThrow();
            // expect(handleDatabaseError).toHaveBeenCalledWith(prismaError);
        });
    });

    describe('getBeastById method', () => {
        it('should return a beast by its id', async () => {
            (prisma.beast.findUnique as jest.Mock).mockResolvedValue(mockBeastData);

            const result = await BeastModel.getBeastById(1);
            expect(result).toEqual(mockBeastData);
            expect(prisma.beast.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    authoredPreesh: {
                        include: {
                            comments: true,
                        },
                    },
                    receivedPreesh: {
                        include: {
                            comments: true,
                        },
                    },
                },
            });
        });

        it('should throw NotFoundError if beast does not exist', async () => {
            (prisma.beast.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(BeastModel.getBeastById(1)).rejects.toThrow(NotFoundError);
        });

        it('should throw UnknownError for an unexpected error', async () => {
            (prisma.beast.findUnique as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

            await expect(BeastModel.getBeastById(1)).rejects.toThrow(UnknownError);
        });
    });

    describe('updateBeast method', () => {
        it('should update a beast successfully', async () => {
            (prisma.beast.update as jest.Mock).mockResolvedValue(mockBeastData);

            const result = await BeastModel.updateBeast(1, 'updatedGamer', 'updated@test.com');
            expect(result).toEqual(mockBeastData);
            expect(prisma.beast.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { gamerTag: 'updatedGamer', email: 'updated@test.com' },
            });
        });

        it('should throw NotFoundError if beast does not exist', async () => {
            (prisma.beast.update as jest.Mock).mockRejectedValue(new Prisma.PrismaClientKnownRequestError('Not found', {
                code: 'P2025',
                clientVersion: '2.29.1',
            }));

            await expect(BeastModel.updateBeast(
                1,
                'updatedGamer',
                'updated@test.com',
            )).rejects.toThrow(NotFoundError);
        });

        it('should throw UnknownError for an unexpected error', async () => {
            (prisma.beast.update as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

            await expect(BeastModel.updateBeast(1, 'updatedGamer', 'updated@test.com')).rejects.toThrow(UnknownError);
        });

        // Test for PrismaClientKnownRequestError with a target field (e.g., trying to update to a duplicate email or gamerTag)
        it('should handle PrismaClientKnownRequestError with target field', async () => {
            const prismaError = new Prisma.PrismaClientKnownRequestError(
                'Duplicate field',
                {
                    code: 'P2002',
                    clientVersion: '2.29.1',
                    meta: { target: ['email'] },
                },
            );
            (prisma.beast.update as jest.Mock).mockRejectedValue(prismaError);

            await expect(BeastModel.updateBeast(1, 'updatedGamer', 'test@test.com')).rejects.toThrow();
            // expect(handleDatabaseError).toHaveBeenCalledWith(prismaError);
        });

        // Test for validation errors from Prisma
        it('should throw UnprocessableEntityError for PrismaClientValidationError', async () => {
            const validationError = new Prisma.PrismaClientValidationError('Validation error', { clientVersion: '2.29.1' });
            (prisma.beast.update as jest.Mock).mockRejectedValue(validationError);

            await expect(BeastModel.updateBeast(1, 'updatedGamer', 'updated@test.com')).rejects.toThrow(UnprocessableEntityError);
        });
    });

    // Add tests for any other methods in the BeastModel class
});

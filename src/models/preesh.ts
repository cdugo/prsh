import { Preesh, Prisma, preeshHeaviness } from '@prisma/client';
import prisma from '../db/init';
import {
    handleDatabaseError,
    NotFoundError, UnknownError, UnprocessableEntityError,
} from './errors';

/**
 * PreeshModel class, handles database operations for preeshes
 */
export default class PreeshModel {
    /**
     * Create a new preesh
     * @param text Content of the preesh
     * @param authorId ID of the beast creating the preesh
     * @param receiverId ID of the beast receiving the preesh
     * @param heaviness Heaviness level of the preesh
     */
    public static async create(
        text: string,
        authorId: number,
        receiverId: number,
        heaviness: preeshHeaviness,
    ): Promise<Preesh> {
        try {
            return await prisma.preesh.create({
                data: {
                    text,
                    author: { connect: { id: authorId } },
                    receiver: { connect: { id: receiverId } },
                    heaviness,
                },
                include: {
                    author: true,
                    receiver: true,
                },
            });
        } catch (error: unknown) {
            PreeshModel.handleErrors(error);
        }
        throw new UnknownError('An unexpected error occurred');
    }

    /**
     * Get a preesh by its id
     * @param id Id of the requested preesh
     */
    public static async getPreeshById(id: number): Promise<Preesh | null> {
        try {
            const preesh = await prisma.preesh.findUnique({
                where: { id },
                include: {
                    author: true,
                    receiver: true,
                    comments: true,
                },
            });

            if (!preesh) {
                throw new NotFoundError(`Preesh with id: ${id} does not exist.`);
            }

            return preesh;
        } catch (error: unknown) {
            PreeshModel.handleErrors(error);
        }
        throw new UnknownError('An unexpected error occurred');
    }

    /**
     * Get preeshes for the feed with pagination
     * @param page Page number (starts from 1)
     * @param pageSize Number of items per page
     */
    public static async getPreeshesFeed(page: number = 1, pageSize: number = 20): Promise<{ preeshes: Preesh[], totalCount: number }> {
        try {
            const skip = (page - 1) * pageSize;
            const [preeshes, totalCount] = await prisma.$transaction([
                prisma.preesh.findMany({
                    skip,
                    take: pageSize,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: true,
                        receiver: true,
                        comments: {
                            include: {
                                author: true,
                            },
                        },
                    },
                }),
                prisma.preesh.count(),
            ]);

            return { preeshes, totalCount };
        } catch (error: unknown) {
            PreeshModel.handleErrors(error);
        }
        throw new UnknownError('An unexpected error occurred');
    }

    /**
     * Get preeshes for a specific beast
     * @param beastId ID of the beast
     * @param page Page number (starts from 1)
     * @param pageSize Number of items per page
     */
    public static async getPreeshesForBeast(
        beastId: number,
        page: number = 1,
        pageSize: number = 20,
    ): Promise<{ preeshes: Preesh[], totalCount: number }> {
        try {
            const skip = (page - 1) * pageSize;
            const [preeshes, totalCount] = await prisma.$transaction([
                prisma.preesh.findMany({
                    where: {
                        OR: [
                            { authorId: beastId },
                            { receiverId: beastId },
                        ],
                    },
                    skip,
                    take: pageSize,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: true,
                        receiver: true,
                        comments: {
                            include: {
                                author: true,
                            },
                        },
                        prees: true,
                    },
                }),
                prisma.preesh.count({
                    where: {
                        OR: [
                            { authorId: beastId },
                            { receiverId: beastId },
                        ],
                    },
                }),
            ]);

            return { preeshes, totalCount };
        } catch (error: unknown) {
            PreeshModel.handleErrors(error);
        }
        throw new UnknownError('An unexpected error occurred');
    }

    private static handleErrors(error: unknown): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            handleDatabaseError(error);
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            throw new UnprocessableEntityError(error.message);
        } else if (error instanceof NotFoundError) {
            throw error;
        } else {
            throw new UnknownError((error as Error).message);
        }
    }
}

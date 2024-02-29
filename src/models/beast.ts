import { Beast, Prisma } from '@prisma/client';
import prisma from '../db/init';
import {
    UnknownError, UnprocessableEntityError, handleDatabaseError, isErrorWithTarget, NotFoundError,
} from './errors';

/**
 * BeastModel class, handles database operations for beasts
 */
export default class BeastModel {
    /**
     * Create a new beast with a unique gamerTag and email
     * @param gamerTag Unique gamerTag (username)
     * @param email Unique email
     */
    public static async create(gamerTag: string, email: string): Promise<Beast> {
        try {
            const beast = await prisma.beast.create({
                data: {
                    gamerTag,
                    email,
                },
            });

            return beast;
        } catch (error: unknown) {
            BeastModel.handleErrors(error);
        }
        // this won't ever get hit, but eslint doesn't like when its not here for some reason lol
        throw new UnknownError('An unexpected error occurred');
    }

    /**
     * Get a beast by its id, also includes the beast's friends and preeshes made/received
     * @param id Id of the requested beast
     */
    public static async getBeastById(id: number): Promise<Beast | null> {
        try {
            const beast = await prisma.beast.findUnique({
                where: {
                    id,
                },
                include: {
                    beastieBros: true,
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
            if (!beast) {
                throw new NotFoundError(`Beast with id: ${id} does not exist.`);
            }

            return beast;
        } catch (error: unknown) {
            BeastModel.handleErrors(error);
        }
        throw new UnknownError('An unexpected error occurred');
    }

    /**
     * Get a beast's friends by its id
     * @param id The id of the beast
     */
    public static async getBeastFriends(id: number): Promise<Beast[] | null> {
        try {
            const beast = await prisma.beast.findUnique({
                where: {
                    id,
                },
                include: {
                    beastieBros: true,
                },
            });
            if (!beast) {
                throw new NotFoundError(`Beast with id: ${id} does not exist.`);
            }

            return beast.beastieBros;
        } catch (error: unknown) {
            this.handleErrors(error);
        }
        throw new UnknownError('An unexpected error occurred');
    }

    /**
     * Updates a beast with the given (optional) gamerTag and (optional) email
     * @param id the id of the beast to update
     * @param gamerTag the new gamerTag
     * @param email the new email
     */
    public static async updateBeast(id: number, gamerTag?: string, email?: string): Promise<Beast | null> {
        // Will only update with the fields that are provided
        const updateData: { gamerTag?: string; email?: string; } = {};

        if (gamerTag) {
            updateData.gamerTag = gamerTag;
        }

        if (email) {
            updateData.email = email;
        }

        // Short circuit if there is nothing to update
        // tbh not really sure what error should be thrown here but def short circuit before accessing db
        // so just doing this xD :P :3
        if (Object.keys(updateData).length === 0) {
            throw new Error('No updates provided');
        }
        try {
            const beast = await prisma.beast.update({
                where: {
                    id,
                },
                data: updateData,
            });

            // Might be unnecessary -> prisma throws an error if update fails because of where filter
            if (!beast) {
                throw new NotFoundError(`Beast with id: ${id} does not exist.`);
            }

            return beast;
        } catch (error: unknown) {
            // I am doing this quick fix here, should be handled by errors file in the future
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundError(`Beast with id: ${id} does not exist.`);
            } else {
                this.handleErrors(error);
            }
        }
        throw new UnknownError('An unexpected error occurred');
    }

    /**
     * Handle database errors from Prisma
     * @param error The error to be handled
     */
    private static handleErrors(error: unknown): Error {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (isErrorWithTarget(error)) {
                handleDatabaseError(error);
            } else {
                throw new UnknownError(error.message);
            }
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            throw new UnprocessableEntityError(error.message);
        } else {
            throw new UnknownError((error as Error).message);
        }
    }
}

import { Beast, Prisma } from '@prisma/client';
import prisma from '../db/init';
import {
    handleDatabaseError,
    NotFoundError, UnknownError, UnprocessableEntityError,
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
    public static async findOrCreateByAppleId(appleId: string, email: string): Promise<Beast> {
        try {
            let beast = await prisma.beast.findUnique({
                where: { appleId },
            });

            if (!beast) {
                const tempGamerTag = `User${Math.floor(Math.random() * 10000)}`;
                beast = await prisma.beast.create({
                    data: {
                        appleId,
                        email,
                        gamerTag: tempGamerTag,
                    },
                });
            }

            return beast;
        } catch (error: unknown) {
            BeastModel.handleErrors(error);
        }
        throw new UnknownError('An unexpected error occurred');
    }

    public static async findByEmail(email: string): Promise<Beast | null> {
        try {
            return await prisma.beast.findUnique({
                where: { email },
            });
        } catch (error: unknown) {
            BeastModel.handleErrors(error);
        }
        return null;
    }

    /**
     * Get a beast by its id, also includes the beast's friends and preeshes made/received
     * @param id Id of the requested beast
     */
    public static async getBeastById(id: number): Promise<Beast | null> {
        let beast;
        try {
            beast = await prisma.beast.findUnique({
                where: {
                    id,
                },
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
        } catch (error: unknown) {
            BeastModel.handleErrors(error);
        }

        if (!beast) {
            throw new NotFoundError(`Beast with id: ${id} does not exist.`);
        }

        return beast;
    }

    /**
     * Updates a beast with the given (optional) gamerTag and (optional) email
     * @param id the id of the beast to update
     * @param gamerTag the new gamerTag
     * @param email the new email
     */
    public static async updateBeast(id: number, gamerTag?: string, email?: string): Promise<Beast | null> {
        // Will only update with the fields that are provided
        const updateData = { gamerTag, email };

        let beast;
        try {
            beast = await prisma.beast.update({
                where: {
                    id,
                },
                data: updateData,
            });
        } catch (error: unknown) {
            this.handleErrors(error);
        }

        // Might be unnecessary -> prisma throws an error if update fails because of where filter
        if (!beast) {
            throw new NotFoundError(`Beast with id: ${id} does not exist.`);
        }

        return beast;
    }

    /**
     * Handle database errors from Prisma
     * @param error The error to be handled
     */
    private static handleErrors(error: unknown): Error {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            handleDatabaseError(error);
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            throw new UnprocessableEntityError(error.message);
        } else {
            throw new UnknownError((error as Error).message);
        }
    }
}

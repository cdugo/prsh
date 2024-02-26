import { Request, Response } from 'express';
import { Beast, Prisma } from '@prisma/client';
import prisma from '../db/init';
import {
    UnknownError, UnprocessableEntityError, handleDatabaseError, isErrorWithTarget,
} from './errors';

export default class BeastModel {
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
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (isErrorWithTarget(error)) {
                    handleDatabaseError(error);
                } else {
                    throw new UnknownError(error.message);
                }
            } else if (error instanceof Prisma.PrismaClientValidationError) {
                throw new UnprocessableEntityError(error.message);
            } else {
                console.error(error);
                throw new UnknownError((error as Error).message);
            }
        }
        // this won't ever get hit, but eslint doesn't like when its not here for some reason lol
        throw new UnknownError('An unexpected error occurred');
    }

    // TODO: Adopt new error handling
    public static async getBeasts(req: Request, res: Response): Promise<void> {
        try {
            const beasts = await prisma.beast.findMany();
            res.status(200).json(beasts);
        } catch (error: unknown) {
            throw new Error((error as Error).message);
        }
    }
}

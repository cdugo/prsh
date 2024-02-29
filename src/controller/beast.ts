import { Request, Response } from 'express';
import BeastModel from '../models/beast';
import { CustomError } from '../models/errors';

/**
 * BeastController class, handles requests for beasts
 */
export default class BeastController {
    /**
     * Create a new beast with a unique gamerTag and email
     * @param req The request which contains the gamerTag and email of the new beast
     * @param res The response which will contain the new beast
     */
    public static async create(req: Request, res: Response): Promise<void> {
        try {
            const { gamerTag, email } = req.body;
            const beast = await BeastModel.create(gamerTag, email);

            res.status(201).json({ message: 'Successfully created', data: beast });
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ error: error.message });
            }
        }
    }

    /**
     * Get a beast by its id
     * @param req The request which contains the id of the requested beast
     * @param res The response which will contain the requested beast
     */
    public static async getBeastById(req: Request, res: Response): Promise<void> {
        let beast = null;
        try {
            const { id } = req.params;
            if (!Number.isNaN(parseInt(id, 10))) {
                beast = await BeastModel.getBeastById(parseInt(id, 10));
            } else {
                // Handle the case where id is not provided as a numerical string
                // Need better error handling or sanitization here imo
                res.status(400).json({ error: 'Invalid ID format' });
            }
            res.status(200).json({ message: 'Successfully retrieved', data: beast });
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ error: error.message });
            }
        }
    }

    /**
     * Get a beast's friends by its id
     * @param req the request which contains the id of the requested beast
     * @param res the response which will contain the requested beast's friends
     */
    public static async getBeastFriends(req: Request, res: Response): Promise<void> {
        let beast = null;
        try {
            const { id } = req.params;
            if (!Number.isNaN(parseInt(id, 10))) {
                beast = await BeastModel.getBeastFriends(parseInt(id, 10));
            } else {
                // Handle the case where id is not provided as a numerical string
                // Need better error handling or sanitization here imo
                res.status(400).json({ error: 'Invalid ID format' });
            }
            res.status(200).json({ message: 'Successfully retrieved', data: beast });
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ error: error.message });
            }
        }
    }

    /**
     * Updates a beast with the given (optional) gamerTag and (optional) email
     * @param req the request which contains the id of the beast to update, and the new gamerTag and email
     * @param res the response which will contain a message indicating the success of the update
     */
    public static async updateBeast(req: Request, res: Response): Promise<void> {
        try {
            const { gamerTag, email } = req.body;
            const { id } = req.params;

            if (Number.isNaN(parseInt(id, 10))) {
                // Handle the case where id is not provided as a numerical string
                // Need better error handling or sanitization here imo
                res.status(400).json({ error: 'Invalid ID format' });
            }

            if (!gamerTag && !email) {
                res.status(400).json({ error: 'Must provide at least one updated parameter' });
            }

            const beast = await
            BeastModel.updateBeast(parseInt(id, 10), gamerTag, email);

            res.status(200).json({ message: 'Successfully updated', data: beast });
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ error: error.message });
            }
        }
    }
}

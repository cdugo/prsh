import { Request, Response } from 'express';
import BeastModel from '../models/beast';
import { CustomError } from '../models/errors';

export default class BeastController {
    public static async create(req: Request, res: Response): Promise<void> {
        try {
            const { gamerTag, email } = req.body;
            const beast = await BeastModel.create(gamerTag, email);

            res.status(201).json(beast);
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ error: error.message });
            }
        }
    }
}

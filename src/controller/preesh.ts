import { Request, Response } from 'express';
import PreeshModel from '../models/preesh';
import { CustomError } from '../models/errors';

export default class PreeshController {
    /**
     * Create a new preesh
     * @param req The request which contains the text, authorId, receiverId, and heaviness of the new preesh
     * @param res The response which will contain the new preesh
     */
    public static async create(req: Request, res: Response): Promise<void> {
        try {
            const {
                text, authorId, receiverId, heaviness,
            } = req.body;
            const preesh = await PreeshModel.create(text, authorId, receiverId, heaviness);
            res.status(201).json({ message: 'Successfully created', data: preesh });
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    /**
     * Get a preesh by its id
     * @param req The request which contains the id of the requested preesh
     * @param res The response which will contain the requested preesh
     */
    public static async getPreeshById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const preesh = await PreeshModel.getPreeshById(parseInt(id, 10));
            res.status(200).json({ message: 'Successfully retrieved', data: preesh });
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    /**
     * Get preeshes for the feed with pagination
     * @param req The request which may contain page and pageSize query parameters
     * @param res The response which will contain the paginated preeshes
     */
    public static async getPreeshesFeed(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string || '1', 10);
            const pageSize = parseInt(req.query.pageSize as string || '20', 10);
            const { preeshes, totalCount } = await PreeshModel.getPreeshesFeed(page, pageSize);
            res.status(200).json({
                message: 'Successfully retrieved',
                data: preeshes,
                page,
                pageSize,
                totalCount,
            });
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    /**
     * Get preeshes for a specific beast (both authored and received)
     * @param req The request which contains the beastId and may contain page and pageSize query parameters
     * @param res The response which will contain the paginated preeshes
     */
    public static async getPreeshesForBeast(req: Request, res: Response): Promise<void> {
        try {
            const { beastId } = req.params;
            const page = parseInt(req.query.page as string || '1', 10);
            const pageSize = parseInt(req.query.pageSize as string || '20', 10);
            const { preeshes, totalCount } = await PreeshModel.getPreeshesForBeast(parseInt(beastId, 10), page, pageSize);
            res.status(200).json({
                message: 'Successfully retrieved',
                data: preeshes,
                page,
                pageSize,
                totalCount,
            });
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }
}

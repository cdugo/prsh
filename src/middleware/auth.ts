import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Beast } from '@prisma/client';
import BeastModel from '../models/beast';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export interface AuthenticatedRequest extends Request {
  beastId: number;
  beast?: Beast;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
            (req as AuthenticatedRequest).beastId = decoded.id;
            return next();
        } catch (error) {
            return res.status(403).json({ error: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ error: 'Authentication required' });
    }
};

export const loadBeast = async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest;
    if (!authenticatedReq.beast && authenticatedReq.beastId) {
        try {
            const beast = await BeastModel.getBeastById(authenticatedReq.beastId);
            if (beast) {
                authenticatedReq.beast = beast;
            } else {
                return res.status(404).json({ error: 'Beast not found' });
            }
        } catch (error) {
            console.error('Error loading beast:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    return next();
};

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if ((req as AuthenticatedRequest).beastId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
};

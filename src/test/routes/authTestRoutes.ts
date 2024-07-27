import express from 'express';
import jwt from 'jsonwebtoken';
import { Beast } from '@prisma/client';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// This route should only be available in development/test environments
router.post('/generate-test-token', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({ error: 'Not found' });
    }

    const testBeast: Partial<Beast> = {
        id: 999,
        gamerTag: 'TestBeast',
        email: 'test@example.com',
    };

    const token = jwt.sign({ id: testBeast.id }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token, beast: testBeast });
});

export default router;

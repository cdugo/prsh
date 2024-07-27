import express, { Request, Response } from 'express';
import BeastController from '../controller/beast';
import { validateId, validationForUpdateBeast } from '../validators/beastValidators';
import { validate } from '../validators/validator';
import { AuthenticatedRequest, authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.get(
    '/:id',
    authenticateJWT,
    validateId(),
    validate,
    async (req: Request, res: Response) => BeastController.getBeastById(req as AuthenticatedRequest, res),
);
router.patch(
    '/:id',
    authenticateJWT,
    validationForUpdateBeast(),
    validateId(),
    validate,
    async (req: Request, res: Response) => BeastController.updateBeast(req as AuthenticatedRequest, res),
);

export default router;

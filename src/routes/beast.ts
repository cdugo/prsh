import express, { Request, Response } from 'express';

import BeastController from '../controller/beast';
import { validateId, validationForCreateBeast, validationForUpdateBeast } from '../validators/beastValidators';
import { validate } from '../validators/validator';

const router = express.Router();

router.post(
    '/',
    validationForCreateBeast(),
    validate,
    async (req: Request, res: Response) => BeastController.create(req, res),
);
router.get(
    '/:id',
    validateId(),
    validate,
    async (req: Request, res: Response) => BeastController.getBeastById(req, res),
);
router.patch(
    '/:id',
    validationForUpdateBeast(),
    validateId(),
    validate,
    async (req: express.Request, res: express.Response) => BeastController.updateBeast(req, res),
);

export default router;

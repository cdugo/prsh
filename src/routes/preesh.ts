import express, { Request, Response } from 'express';
import {
    validationForCreatePreesh,
    validateId,
    validatePagination,
    validateBeastId,
} from '../validators/preeshValidators';
import { validate } from '../validators/validator';
import PreeshController from '../controller/preesh';

const router = express.Router();

router.post(
    '/',
    validationForCreatePreesh(),
    validate,
    async (req: Request, res: Response) => PreeshController.create(req, res),
);

router.get(
    '/:id',
    validateId(),
    validate,
    async (req: Request, res: Response) => PreeshController.getPreeshById(req, res),
);

router.get(
    '/',
    validatePagination(),
    validate,
    async (req: Request, res: Response) => PreeshController.getPreeshesFeed(req, res),
);

router.get(
    '/beast/:beastId',
    validateBeastId(),
    validatePagination(),
    validate,
    async (req: Request, res: Response) => PreeshController.getPreeshesForBeast(req, res),
);

export default router;

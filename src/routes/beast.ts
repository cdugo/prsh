import express from 'express';

import BeastController from '../controller/beast';

const router = express.Router();

router.post('/create', async (req, res) => BeastController.create(req, res));

export default router;

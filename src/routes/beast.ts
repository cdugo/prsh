import express from 'express';

import BeastController from '../controller/beast';

const router = express.Router();

router.post('/create', async (req, res) => BeastController.create(req, res));

router.get('/getBeasts', async (req, res) => BeastController.getBeasts(req, res));

export default router;

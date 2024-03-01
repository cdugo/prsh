import express from 'express';

import BeastController from '../controller/beast';

const router = express.Router();

router.post('/', async (req, res) => BeastController.create(req, res));
router.get('/:id', async (req, res) => BeastController.getBeastById(req, res));
router.patch('/:id', async (req, res) => BeastController.updateBeast(req, res));

export default router;

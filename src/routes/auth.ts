import express from 'express';
import AuthController from '../controller/auth';

const router = express.Router();

router.post(
    '/apple',
    AuthController.appleSignIn,
);

export default router;

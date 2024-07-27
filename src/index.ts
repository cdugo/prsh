import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors = require('cors');
import BeastRoutes from './routes/beast';
import AuthRoutes from './routes/auth';
import authTestRoutes from './test/routes/authTestRoutes';

require('express-async-errors');

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/beast', BeastRoutes);
app.use('/auth', AuthRoutes);

if (process.env.NODE_ENV !== 'production') {
    app.use('/auth-test', authTestRoutes);
}

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import BeastRoutes from './routes/beast';
import PreeshRoutes from './routes/preesh';

require('express-async-errors');

dotenv.config();

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/beast', BeastRoutes);
app.use('/preesh', PreeshRoutes);

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

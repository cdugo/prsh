import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import BeastRoutes from './routes/beast';
import { CustomError } from './models/errors';

dotenv.config();

require('express-async-errors');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/beasts', BeastRoutes);

app.use((err: Error, req: Request, res: Response) => {
    if (err instanceof CustomError) {
        // Handle custom errors
        res.status(err.statusCode).json({ message: err.message });
    } else {
        // Handle generic errors
        console.error(err); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

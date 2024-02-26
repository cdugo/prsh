import express from 'express';
import bodyParser from 'body-parser';
import BeastRoutes from './routes/beast';

require('express-async-errors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/beast', BeastRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

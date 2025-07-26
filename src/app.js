import express from 'express';
import { formRouter } from './routes/index.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.route('/').get((req, res) => {
    res.send('Welcome to the Google Forms-like backend!');
});

app.use('/api/v1/form', formRouter);


export default app;
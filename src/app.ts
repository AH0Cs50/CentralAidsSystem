import express from 'express';
import { PORT } from './config/config.js';
//routers
import authRouter from './users/web/routes/auth.route.js';

const app = express();

//app construction
app.use('api/v1/auth', authRouter);

const port =PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
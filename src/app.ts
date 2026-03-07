import express from 'express';
import { PORT } from './shared/config/config.js';
import DB from './shared/db/connection.js';
import type { Sequelize } from 'sequelize';
//routers
import authRouter from './users/web/routes/auth.route.js';
import { symlinkSync } from 'node:fs';

const app = express();

//app construction
//global 
app.use(express.json());

//my routers
app.use('api/v1/auth', authRouter);

const port = PORT || 3000;

const DBconnection: Sequelize = DB.getInstance().getConnection();

async function startServer(): Promise<void> {
    try {
        await DBconnection.authenticate(); //check db connection

        await DBconnection.sync({ alter: true }); //sync db models that assign to sequelize connection manager

        app.listen(port, () => {
            console.log(`server start listening at port ${port}`);
        })
    } catch (err) {
        console.log('unable to connect to database:' + err);
        process.exit(1); //stop the server process
    }
}



startServer(); // create server process


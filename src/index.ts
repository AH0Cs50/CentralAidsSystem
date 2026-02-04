
import { PORT } from './config/config.js';

import express from 'express';

const app = express();


const port = PORT || 5500;

app.listen(port,()=>{
    console.log(`server run on port ${port}`);
})


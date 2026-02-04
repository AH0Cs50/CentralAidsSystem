import { config } from "dotenv";
import { compose } from "node:stream";

config({path:'./config.env'})

const {PORT} = process.env;

console.log(PORT);

export {
    PORT,
}
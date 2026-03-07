import { Model } from "sequelize";
import DB from "../../../shared/db/connection.js";

export class UserModel extends Model {
    declare id: number;
    declare first_name: string;
    declare last_name: string;

}


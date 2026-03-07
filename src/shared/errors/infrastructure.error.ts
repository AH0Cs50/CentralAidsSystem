import { HttpError } from "./main.erorr.js";

export class DatabaseError extends HttpError {
    constructor(message = "Database operation failed") {
        super(500, message);
        this.name = "DatabaseError";
    }
}

export class EmailSendError extends HttpError {
    constructor(message = "Failed to send email") {
        super(500, message);
        this.name = "EmailSendError";
    }
}
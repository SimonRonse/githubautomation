export class NotFoundError extends Error {
    status = 404;
    constructor(message = "Resource not found") {
        super(message);
        this.name = "NotFoundError";
    }
}

export class ForbiddenError extends Error {
    status = 403;
    constructor(message = "Access denied") {
        super(message);
        this.name = "ForbiddenError";
    }
}

export class BadRequestError extends Error {
    status = 400;
    constructor(message = "Invalid request") {
        super(message);
        this.name = "BadRequestError";
    }
}

export class ServerError extends Error {
    status = 500;
    constructor(message = "Internal server error") {
        super(message);
        this.name = "ServerError";
    }
}

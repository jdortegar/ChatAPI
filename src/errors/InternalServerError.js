import httpStatus from 'http-status';
import HttpError from "./HttpError";

class InternalServerError extends HttpError {
    constructor(res, ...args) {
        super(res, httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', ...args);
    }
}

export default InternalServerError;
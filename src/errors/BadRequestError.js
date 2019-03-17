import httpStatus from 'http-status';
import HttpError from './HttpError';

class BadRequestError extends HttpError {
    constructor (res, ...args) {
        super(res, httpStatus.BAD_REQUEST, 'Bad Request', ...args);    
    }
}

export default BadRequestError;
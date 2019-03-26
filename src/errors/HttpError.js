class HttpError extends Error {
    constructor (res, status, errorType, ...args) {
        super(...args);
        this.res = res;
        this.status = status,
        this.errorType = errorType;
    }

    getResponse() {
        this.res.status(this.status).json({
            error: this.errorType,
            message: this.message
        })
    }
}

export default HttpError;
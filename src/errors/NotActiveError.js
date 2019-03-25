class NotActiveError extends Error {
    constructor(record, ...args) {
        super(...args);
        this.record = record;
    }
}

export default NotActiveError;
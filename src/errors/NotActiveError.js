class NotActiveError extends Error {
    constructor(record, ...args) {
        this.record = record;
        super(...args);
    }
}

export default NotActiveError;
import { NotAuthorizedError } from './NotAuthorizedError.js';

export class PermissionError extends NotAuthorizedError {
    constructor(msg: string) {
        super(msg);
        this.name = 'PermissionError';
    }
}

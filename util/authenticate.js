import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { AuthenticationError } from 'apollo-server-express';

export const authenticate = (context) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, JWT_SECRET);
                return user;
            } catch (error) {
                throw new AuthenticationError('invalid/expired token');
            }
        }
        throw new Error('authentication token must be \'Bearer [token]');
    } else {
        throw new Error('authorization header must be provided');
    }
}
import { Users } from '../../schema/index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/index';
import { UserInputError } from 'apollo-server-express';
import { validateRegisterInput, validateLogInInput } from '../../util/validator';

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, JWT_SECRET, { expiresIn: '1h' });
}

const usersResolvers = {
    // resolver corresponding to each query, mutation
    Mutation: {
        async register(parent, { registerInput: { username, email, password, confirmPassword } }, context, info) {
            const { error, valid } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                return new UserInputError(error.message, { 
                    errors: { message: error.message } 
                });
            }
            const isUsernameExists = await Users.find({ username });
            if (isUsernameExists.length) {
                throw new UserInputError("username already exists", {
                    errors: { message: "username already exists" }
                });
            }
            const isEmailExists = await Users.find({ email });
            if (isEmailExists.length) {
                throw new UserInputError("email already exists", {
                    errors: { message: "email already exists" }
                });
            }
            password = await bcrypt.hash(password, 12);
            const newUser = new Users({
                username,
                password,
                email
            });
            const result = await newUser.save();
            const token = generateToken(result);
            return {
                ...result._doc,
                id: result._id,
                token
            }
        },

        async login(parent, { email, password }, context, info) {
            const { error, valid } = validateLogInInput(email, password);
            if (!valid) {
                return new UserInputError('error', { error });
            }
            const user = await Users.findOne({ email });
            if (!user) {
                throw new UserInputError('wrong credentials', { error });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                throw new UserInputError('wrong credentials', { error });
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            }
        }
    }
}

export default usersResolvers;
import Joi from 'joi';

export const validateRegisterInput = (username, email, password, confirmPassword) => {
    const registerUserSchema = Joi.object({
        username: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        confirmPassword: Joi.ref('password')
    });
    const {error} = registerUserSchema.validate({username, email, password, confirmPassword});
    return {
        error,
        valid: error ? false : true
    };
}

export const validateLogInInput = (email, password) => {
    const logInUserSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    });
    const {error} = logInUserSchema.validate({email, password});
    return {
        error,
        valid: error ? false : true
    }
}


const { check, validationResult } = require('express-validator');
const { BadRequestError } = require('../errors');
const validateSignup = [
    check('firstName')
        .notEmpty()
        .withMessage('First Name must be provided'),
    check('lastName')
        .notEmpty()
        .withMessage('Last Name must be provided'),
    check('email')
        .notEmpty()
        .withMessage('Email must be provided')
        .isEmail()
        .withMessage('Email is invalid'),
    check('password')
        .notEmpty()
        .withMessage('Password must be provided')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

];

const validateSignin = [
    check('email')
        .notEmpty()
        .withMessage('Email must be provided')
        .isEmail()
        .withMessage('Email is invalid')
]

const isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        throw new BadRequestError(errors.array()[0].msg);
    }
    next();

}
module.exports = {
    validateSignup,
    validateSignin,
    isRequestValidated
}

const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const signin = async (req, res) => {


    res.send('login');
};

const signup = async (req, res) => {
    const emailExits = await User.findOne({ email: req.body.email });
    if (emailExits) {
        throw new BadRequestError('Email already exists');
    };
    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ user });
};

module.exports = {
    signin,
    signup,
}
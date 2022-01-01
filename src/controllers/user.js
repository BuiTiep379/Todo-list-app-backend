const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const { createJWT } = require('../middlewares/user-middleware');
const User = require('../models/user');
const signin = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        throw new NotFoundError('No user found');
    }
    const checkPassword = await user.comparePassword(req.body.password);
    if (!checkPassword) {
        throw new BadRequestError('Password is incorrect');
    };
    const token = await createJWT(user);
    res.cookie("token", token, { expiresIn: "1d" });
    res.status(StatusCodes.OK).json({ user, token });
};

const signup = async (req, res) => {
    const emailExits = await User.findOne({ email: req.body.email });
    if (emailExits) {
        throw new BadRequestError('Email already exists');
    };
    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ user });
};

const signout = (req, res) => {
    res.clearCookie('token');
    res.status(StatusCodes.OK).json({ msg: "Signout successfully...!" });
}

module.exports = {
    signin,
    signup,
    signout
}
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const { createJWT } = require('../middlewares/user-middleware');
const User = require('../models/user');

const signin = async (req, res) => {
    let user = await User.findOne({ $or: [{ 'fb.email': req.body.email }, { 'gg.email': req.body.email }] });
    if (user) {
        throw new BadRequestError('Email login by facebook or google');
    } else {
        user = await User.findOne({ 'lc.email': req.body.email });
        if (!user) {
            throw new NotFoundError('No user found');
        }
        if (!password) {
            throw new BadRequestError('Password must be provided');
        } else if (password.length < 6) {
            throw new BadRequestError('Password must be at least 6 characters');
        }
        const checkPassword = await user.comparePassword(req.body.password);
        if (!checkPassword) {
            throw new BadRequestError('Password is incorrect');
        };
        const token = await createJWT(user);
        res.cookie("token", token, { expiresIn: "1d" });
        // res.status(StatusCodes.OK).json({ user, token });

        res.render('dashboard', {
            name: user.lc.firstName,
            user,
        })
    }
};

const signup = async (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    const emailExits = await User.findOne({ 'email': email });
    if (emailExits) {
        throw new BadRequestError('Email already exists');
    };
    const newUser = {
        lc: {
            email, firstName, lastName, password
        }
    }
    const user = await User.create(newUser);
    res.status(StatusCodes.CREATED).json({ user });
};

const signout = (req, res) => {
    res.clearCookie('token');
    res.status(StatusCodes.OK).json({ msg: "Signout successfully...!" });
};

module.exports = {
    signin,
    signup,
    signout,
}
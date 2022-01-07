const { StatusCodes } = require('http-status-codes');
const { createJWT } = require('../middlewares/user-middleware');
const User = require('../models/user');

const signin = async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ $or: [{ 'fb.email': email }, { 'gg.email': email }] });
    if (user) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email login by facebook or google" });
        // throw new BadRequestError('Email login by facebook or google');
    } else {
        user = await User.findOne({ 'lc.email': email });
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "No user found" });
            //throw new NotFoundError('No user found');
        }
        if (!password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password must be provided" });
            // throw new BadRequestError('Password must be provided');
        } else if (password.length < 6) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password must be at least 6 characters" });
            // throw new BadRequestError('Password must be at least 6 characters');
        }
        const checkPassword = await user.comparePassword(req.body.password);
        if (!checkPassword) {
            return res.status(400).json({ message: "Password is incorrect" });
            // throw new BadRequestError('Password is incorrect');
        };
        const token = await createJWT(user);
        res.cookie("token", token, { expiresIn: "1d" });
        res.status(StatusCodes.OK).json({ user, token });

        // res.render('dashboard', {
        //     name: user.lc.firstName,
        //     user,
        // })
    }
};

const signup = async (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    const emailExits = await User.findOne({ $or: [{ 'fb.email': email }, { 'gg.email': email }, { 'lc.email': email }] });
    console.log(emailExits);
    if (emailExits) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already exists" });
        // throw new BadRequestError('Email already exists');
    };
    const newUser = {
        lc: {
            email, firstName, lastName, password
        }
    }
    await User.create(newUser);
    res.status(StatusCodes.CREATED).json({ message: 'User created successfully' });
};

const signout = (req, res) => {
    res.clearCookie('token');
    res.status(StatusCodes.OK).json({ message: "Signout successfully...!" });
};

module.exports = {
    signin,
    signup,
    signout,
}
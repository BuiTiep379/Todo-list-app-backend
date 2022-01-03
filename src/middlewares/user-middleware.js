const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
// save the token

const createJWT = async (user) => {
    const token = await jwt.sign({ _id: user._id, email: user.lc.email, fullName: user.lc.fullName }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    });

    return token;
};

const requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        // console.log(token);
    } else {
        throw new UnauthenticatedError('Authorization required');
    }
    next();
};

module.exports = {
    createJWT,
    requireSignin,
}
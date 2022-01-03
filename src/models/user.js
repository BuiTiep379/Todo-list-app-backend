const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fb: {
        id: {
            type: String,
        },
        displayName: {
            type: String,
        },
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
        },
    },
    gg: {
        id: {
            type: String,
        },
        displayName: {
            type: String,
        },
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
        },
    },
    lc: {
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            minLength: 6
        },
        email: {
            type: String,
        },
    }

}, { timestamps: true });



// hash password and save user 
userSchema.pre('save', async function (next) {
    /*
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    */
    //c2
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('lc.password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.lc.password = await bcrypt.hash(this.lc.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.lc.password);
    return isMatch;
};
userSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

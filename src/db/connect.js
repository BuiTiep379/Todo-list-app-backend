const mongoose = require('mongoose');

const connectDB = async (url) => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log('Connect successfully!!!'))
        .catch(() => console.log('Error connecting to database!!!'));
};

module.exports = connectDB;
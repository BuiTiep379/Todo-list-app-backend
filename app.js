const express = require('express');
const morgan = require('morgan');
// const passport = require('passport');
// const session = require('express-session');
require('express-async-errors');
require('dotenv').config();

const app = express();

// router middleware
const notFoundMiddleware = require('./src/middlewares/not-found');
const errorHandlerMiddleware = require('./src/middlewares/error-handler');
// passport middleware
// const { passportFacebook } = require('./src/middlewares/passport');

// connect mongodb
const connectDB = require('./src/db/connect');

// route
const authRouter = require('./src/routes/user');

// morgan
app.use(morgan('dev'));


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// passport
// app.use(passport.initialize());
// app.use(passport.session());

// //session
// app.use(session({
//     resave: false,
//     saveUninitialized: true,
//     secret: 'SECRET'
// }));
// // router

// passportFacebook(passport);

app.use('/api/v1/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
// port
const PORT = process.env.PORT || 2000;

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () => {
            console.log(`App run at http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
};
start();




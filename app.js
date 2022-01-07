require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const { engine } = require('express-handlebars');
const cors = require('cors');
// require('express-async-errors');

const app = express();

// passport middleware
const { passportGoogle, passportFacebook } = require('./src/middlewares/passport');

passportGoogle(passport);
passportFacebook(passport);
// connect mongodb
const connectDB = require('./src/db/connect');

// route
const authRouter = require('./src/routes/user');

// morgan
app.use(morgan('dev'));


//middleware
app.use(express.static(path.join(__dirname, './src/public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/// express-handlebar engine 
app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './src/views'));

// Sessions
app.use(
    session({
        secret: 'XUAN PHUONG',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    })
)
/// passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// set global var 
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// // router

// passportFacebook(passport);
app.use('/auth', authRouter);
app.use('/', require('./src/routes/index'));
// port
const PORT = process.env.PORT || 2000;

connectDB(process.env.MONGODB_URL);
app.listen(PORT, () => {
    console.log(`App run at http://localhost:${PORT}`);
});





import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';
import expressValidator from 'express-validator';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';
import Strategy from 'passport-local';
let LocalStrategy = Strategy.Strategy;
import mongo from 'mongodb';
import mongoose from 'mongoose';

// ROUTES
import routes from './routes/index';
import users from './routes/users';

mongoose.connect('mongodb://localhost/loginapp');
let db = mongoose.connection;

// INIT APP
let app = express();
let PORT = process.env.PORT || 3300;

// VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// EXPRESS SESSION MIDDLEWARE
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// PASSPORT INIT
app.use(passport.initialize());
app.use(passport.session());

// EXPRESS VALIDATOR
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// CONNECT FLASH
app.use(flash());

// GLOBAL VARS
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('./utils/db');
const mysqlConf = require('./config/mysql.json');
const index = require('./app/server/routes/index');
const users = require('./app/server/routes/users');
const game = require('./app/server/routes/game');
const apiImg = require('./app/api/routes/image');
const apiScore = require('./app/api/routes/scores');
require('./utils/passport');

const app = express();
db.connect(mysqlConf);

// view engine setup
app.set('views', path.join(__dirname, 'app', 'server', 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use('/', index);
app.use('/users', users);
app.use('/game', game);
app.use('/api/image', apiImg);
app.use('/api/scores', apiScore);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message": err.name + ":" + err.message});
  }
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

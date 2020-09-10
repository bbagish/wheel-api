var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var cors = require("cors");
var positionsRoute = require('./routes/positions');
var tradeRoute = require('./routes/trades');
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const error = require("./middleware/error");

var app = express();

require("./startup/db")();
// require("./startup/seed")();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use('/api/positions', positionsRoute);
app.use('/api/positions/:id/trades', tradeRoute);

//AUTH WORK IN THE PROGRESS
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use(error);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

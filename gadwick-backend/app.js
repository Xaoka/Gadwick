var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

// var indexRouter = require('./routes/index');
var featuresRouter = require('./routes/mysql/Features');
// var reportsRouter = require('./routes/reports');
var resultsRouter = require('./routes/mysql/Results');
var applicationsRouter = require('./routes/mysql/Applications');
var statsRouter = require('./routes/mysql/Stats');
var usersRouter = require('./routes/mysql/Users');
var sessionsRouter = require('./routes/mysql/Sessions');
var rolesRouter = require('./routes/mysql/Roles');
var purchasesRouter = require('./routes/mysql/Purchases');

// var cors = require('cors')
var app = express();
app.use(cors())

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.options('*', cors()) // include before other routes

// app.use('/', indexRouter);
app.use('/features', featuresRouter);
app.use('/stats', statsRouter);
app.use('/results', resultsRouter);
app.use('/applications', applicationsRouter);
app.use('/users', usersRouter);
app.use('/sessions', sessionsRouter);
app.use('/roles', rolesRouter);
app.use('/purchases', purchasesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  res.send("Page not found");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.send(`Error: ${res.locals.error}`);
});

module.exports = app;

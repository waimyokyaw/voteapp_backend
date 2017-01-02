'use strict';

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var passport	= require('passport');
var config      = require('./server/models/database'); // get db config file
//var User        = require('./app/models/user'); // get the mongoose model
var routes = require('./server/routes/route');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var User   = require('./server/models/user');

var port        = process.env.PORT || 8080;

app.set('mysecret', 'iloveme');
// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

// Browse (http://localhost:8080)
app.get('/', function(req, res) {
  //var api_function_list = '[view_restaurants] [view_menu] [vote_restaurant] [view_votes]';
  res.send('Hello! The API is at http://localhost:' + port + '/api/');
});

// Start the server
app.listen(port);
console.log('Server running at http://localhost:' + port);

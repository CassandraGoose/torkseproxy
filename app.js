var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var cors = require('cors');

require('dotenv').load();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const {version, text} = req.query;

  if(!text) {
    res.status(500);
    res.json({
      status: 'Error',
      message: 'Missing version and text parameters'
    });
  } else {
    const APIURL = `https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&text=${text}`;

    fetch(APIURL, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${process.env.AUTH_CODE}`
      }
    }).then(response => {
      return response.json();
    }).then(json => {
      res.json(json);
    }).catch(error => {
      res.status(500);
      res.json({
        status: 'Error',
        error
      });
    });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

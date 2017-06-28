//these are all the dependancies and things I am using in my express app (server)
//these need to be npm-installed
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var cors = require('cors');
//the line below is saying 'we're going to use information from the .env file later'
//it should be installed using npm install -S dotenv
//and then create a .env file to put your authorizaiton stuff in.
require('dotenv').load();

//then we need to make an instance of express. this is saying 'when i use the word 'app', we are using express'
var app = express();

//the stuff below is us actually using some of the dependancies from above.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


//the stuff below is the main part
//this is our 'route', which the front end will make a get request to and then this will make a get request to the watson tone analyzer.
app.get('/', (req, res) => {
  //set variable to the input from the user.
  const {text} = req.query;
//if there isn't any text, send an error.
  if(!text) {
    res.status(500);
    res.json({
      status: 'Error',
      message: 'Missing text parameter'
    });
    //if there is text, do this stuff:
  } else {
    //set a variable for the url to api that has the text attached to it.
    const APIURL = `https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&text=${text}`;

//using 'fetch', we make a get request to that api url and send authorization headers. these headers refer to the .env that keeps our auth code safe.
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
      res.status(500).json({
        status: 'Error',
        error
      });
    });
  }
});

//the stuff below just comes with the express generator, but it is still important. feel free to copy and paste this and learn about it more in q2
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

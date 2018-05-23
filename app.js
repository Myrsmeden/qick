var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('dotenv').config()

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(process.env.MONGODB_URI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', function() {
  console.log("Connected!")
})

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
var passport = require('passport')
var expressSession = require('express-session')
app.use(expressSession({secret: process.env.secret}))
app.use(passport.initialize())
app.use(passport.session())

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());
 
// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

// Set up routes
var routes = require('./routes/index')(passport);
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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


var serve = http.createServer(app);
var io = require('socket.io')(serve);

serve.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var QueueItem = require('./models/queueItem')
var Queue = require('./models/queue')

io.on('connection', function (socket) {
  socket.on('disconnect', function () {
      // User disconnected
  });
  socket.on('message', function (msg) {
    if ( msg.action === "queue") {
      item = new QueueItem({name: msg.name});
      Queue.findOne({name: msg.track}, function(err, instance) {
        if (err) console.log("Error!")
        instance.items.push(item)
        instance.save(function(err) {
          //
        })
      })
    }
    if ( msg.action === "dequeue") {
      Queue.update( {name: msg.track}, { $pull: {items: {name: msg.name} } }, 
      {multi: true}, 
      function(err, obj) {
        //
      } )
    }
    io.sockets.emit('message', msg);
  });
});
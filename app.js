var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
require('dotenv').config()


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/queue/:track/:name', routes.queue);

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(process.env.MONGODB_URI, function (err, res) {
  if (err) {
      console.log('ERROR connecting to: ' + process.env.MONGODB_URI + '. ' + err);
  } else {
      console.log('Succeeded connected to: ' + process.env.MONGODB_URI);
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', function() {
  console.log("Connected!")
})

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
          console.log(err)
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
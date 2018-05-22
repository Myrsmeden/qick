var mongoose = require('mongoose');
require('dotenv').config()

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
    var Queue = require('./models/queue')
    var QueueItem = require('./models/queueItem')
    
    var tracks = ["Skaparspåret", "Scratch"]
    for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i]
        var queue = new Queue({name: track})
        queue.save(function(err) {
            if (err) {
                console.log("Kunde inte skapa spår " + track)
            } 
        });
    }
})



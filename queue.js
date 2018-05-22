var Queue = require('/models/queue')
var QueueItem = require('/models/queueItem')

var tracks = ["Skaparspåret", "Scratch"]

for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i]
    Queue.create({name: track}, function(err, inst) {
        if (err) console.log("Kunde inte skapa spår " + track)
        console.log(track)
    })
}


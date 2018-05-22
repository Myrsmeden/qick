var Queue = require('./models/queue');
var QueueItem = require('./models/queueItem');

exports.index = function(req, res){
    Queue.find({}, function(err, queue) {
        if ( err ) {
            console.err(err);
        }
        console.log(queue);
        res.render('index', { title: 'Muu', queue: queue });
    })
};

exports.queue = function(req, res){
    var track = req.params.track;
    var name = req.params.name;
    Queue.findOne({name: track}, function(err, queue) {
        var items = queue.items || []
        console.log(queue)
        console.log(items)
        res.render('queue', { title: 'Kön', track: track, name: name, queue: items });
    })
};

exports.user = function(req, res){
    res.render('index', { title: 'User' });
};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var queueItemSchema = new Schema({
    name: String,
    added: Date
});

module.exports = mongoose.model('QueueItem', queueItemSchema);
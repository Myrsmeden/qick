$(function() {
    var toQueue = function(e) {
        e.preventDefault();
        var track = $('select[name="track"] option:selected').val();
        var name = $('input[name="name"]').val();
        window.location.href = '/queue/' + track + '/' + name;
        return false;
    }
    $('#toQueue').click(toQueue);
});
var socket = io();
var addToQueue = function(track, name) {
    console.log("Clicking the button");
    var msg = {
        track: track,
        name: name,
        action: 'queue'
    }
    socket.emit('message', msg);
    return false;
}
socket.on('message', function (msg) {
    console.log("Received message");
    console.log(msg);
    if ( msg.action === "queue")
        $('#queue-list').append($('<li>').text(msg.name));
});

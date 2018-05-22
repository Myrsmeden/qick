var socket = io();
var addToQueue = function() {
    console.log("Clicking the button");
    var msg = "Hallå!";
    socket.emit('message', msg);
    $('#messages').append($('<p>').text(msg));
    $('#message-box').val('');
    return false;
}
socket.on('message', function (msg) {
    console.log("Received message");
    console.log(msg);
    $('#messages').append($('<p>').text(msg));
});

var showButtons = function() {
    var in_queue = $('#queue').hasClass('in_queue');
    if ( in_queue ) {
        $('.add-to-queue').hide()
        $('.remove-from-queue').show()
    } else {
        $('.add-to-queue').show()
        $('.remove-from-queue').hide()
    }
}

$(function() {
    var toQueue = function(e) {
        e.preventDefault();
        var track = $('select[name="track"] option:selected').val();
        var name = $('input[name="name"]').val();
        window.location.href = '/queue/' + track + '/' + name;
        return false;
    }
    $('#toQueue').click(toQueue);

    showButtons()
});
var socket = io();
var addToQueue = function(track, name) {
    var msg = {
        track: track,
        name: name,
        action: 'queue'
    }
    socket.emit('message', msg);
    $('#queue').addClass('in_queue')
    showButtons()
    return false;
}

var removeFromQueue = function(track, name) {
    var msg = {
        track: track,
        name: name,
        action: 'dequeue'
    }
    socket.emit('message', msg);
    $('#queue').removeClass('in_queue')
    showButtons()
    return false;
}
socket.on('message', function (msg) {
    console.log('Received message');
    console.log(msg);
    if ( msg.action === 'queue')
        $('#queue-list').append($('<li>').text(msg.name))
        $('#queue-list-admin').append('<li><p>' + msg.name + '</p><span class="fa fa-times"></span></li>')
        $('.queue-empty').hide()
    if ( msg.action === 'dequeue')
        $('li').filter(function() { return $.text([this]) === msg.name; }).remove()
});

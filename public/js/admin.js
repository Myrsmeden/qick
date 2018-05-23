$(function() {
    var socket = io();
    var toQueue = function(e) {
        e.preventDefault();
        var track = $('select[name="track"] option:selected').val();
        var name = $('input[name="name"]').val();
        window.location.href = '/admin/queue/' + track
        return false;
    }
    $('#toAdminQueue').click(toQueue);
    $('#queue-list-admin').on('click', 'li span', function(e) {
        e.preventDefault();
        console.log("click")
        var name = $(this).parent('li').find('p').text()
        var track = $('#queue-list-admin').prop('data-track')
        var msg = {
            track: track,
            name: name,
            action: 'dequeue'
        }
        socket.emit('message', msg);
        $(this).parent('li').remove()
        return false;
    })

});
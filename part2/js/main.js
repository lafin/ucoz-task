var socket = io.connect(window.location.protocol + '//' + window.location.host, {
    'transports': [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling',
        'polling'
    ]
});

var messages = $('.messages tbody'),
    users = $('.users tbody');

socket.on('message', function (message) {
    messages.append('<tr><td><b>[' + moment(Date.now()).format('hh:mm:ss') + '] ' + message.name + '</b>: ' +
        message.text + '</td></tr>');
});

socket.on('system', function (message) {
    switch (message.type) {
    case 'enter':
        users.append('<tr data-name="' + message.name + '"><td>' + message.name + '</td></tr>');
        messages.append('<tr><td>"' + message.name + '" joined the chat</td></tr>');
        break;
    case 'exit':
        $('.users tbody tr[data-name="' + message.name + '"]').remove();
        messages.append('<tr><td>"' + message.name + '" left the chat</td></tr>');
        break;
    case 'init':
        for (var i = 0; i < message.users.length; i++) {
            var user = message.users[i];
            users.append('<tr data-name="' + user + '"><td>' + user + '</td></tr>');
        }
        break;
    }
});

// send message
function onSend() {
    socket.emit('message', $('#message').val());
    $('#message').val('');
}
$('#message').keydown(function (event) {
    if (event.keyCode === 13) {
        onSend();
        return false;
    }
});
$('.send').on('click', onSend);

// enter/signup/register
function onEnder() {
    socket.emit('system', {
        type: 'enter',
        name: $('#name').val()
    });
    $('.message-form').removeClass('hide');
    $('.enter-form').addClass('hide');
}
$('#name').keydown(function (event) {
    if (event.keyCode === 13) {
        onEnder();
        return false;
    }
});
$('.enter').on('click', onEnder);

// logout, lol :p
$('.logout').on('click', function () {
    document.location.reload();
});
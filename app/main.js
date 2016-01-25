var socket = io();
$('form').submit(function(){
    var userInput = $('#m').val();
    
    if (/^\//.test(userInput)) {
        var match = userInput.slice(1).split(' ');
        socket.emit('command', {
            type: match[0],
            args: match.slice(1)
        });
    } else {
        socket.emit('chat message', userInput);
    }
    
    $('#m').val('');
    return false;
});
socket.on('chat message', function (msg) {
    var nick = msg.nick,
        text = msg.msg;
    
    var str = `<li><span class="nick">${nick}</span>: ${text}</li>`;
    $('#messages').append(str);
});
socket.on('system message', function (msg) {
    var str = `<li class="system">${msg}</li>`;
    $('#messages').append(str);
});

socket.on('nick update', function (nickList) {
    $('#users').html(nickList.sort().map(x => "<li>" + x + "</li>").join(''));
})
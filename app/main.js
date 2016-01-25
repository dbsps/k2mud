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
    
    var str = `<li><span class="nick">${nick}</span>:  ${text}</li>`;
    smartScrollAppend(str);
});
socket.on('system message', function (msg) {
    var str = `<li class="system">${msg}</li>`;
    smartScrollAppend(str);
});

var out = document.getElementById("out");

function smartScrollAppend(str) {
    var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
    if (isScrolledToBottom) {
        $('#messages').append(str);
        out.scrollTop = out.scrollHeight - out.clientHeight;
    } else {
        $('#messages').append(str);
    }
}
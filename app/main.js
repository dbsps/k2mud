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
    $('#messages').append(str);
    $container = $('.wrapper');
    $container.animate({ scrollTop: $container[0].scrollHeight }, "slow");
});
socket.on('system message', function (msg) {
    var str = `<li class="system">${msg}</li>`;
    $('#messages').append(str);
    $container = $('.wrapper');
    $container.animate({ scrollTop: $container[0].scrollHeight }, "slow");
});

$container = $('.wrapper');
$container[0].scrollTop = $container[0].scrollHeight;

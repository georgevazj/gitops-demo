var express = require('express');
var app = express();

//var message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat odio sed lobortis finibus. Pellentesque posuere rutrum ultrices. Praesent maximus.'
var message = 'Hola mundo!'
app.get('/', function(req, res) {
    res.send(message);
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App escuchando a http://%s:%s', host, port);
});
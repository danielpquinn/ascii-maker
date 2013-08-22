var fs = require('fs'),
  express = require('express'),
  app = express()
  server = require('http').createServer(app);

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
  fs.createReadStream('./static/index.html');
});

server.listen(8001);
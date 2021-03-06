var fs = require('fs'),
  express = require('express'),
  app = express(),
  server = require('http').createServer(app);

app.use(express.favicon('static/favicon.ico'));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: "static/uploads" }));
app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
  fs.createReadStream('./static/index.html');
});

app.post('/api/upload', function (req, res) {
  console.log(req);
  res.send(req.files);
});

server.listen(8001);
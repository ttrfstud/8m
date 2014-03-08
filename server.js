var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
	if (req.url.indexOf('script.js') === -1) {
		var stream = fs.createReadStream(__dirname + '/index.html');
	} else {
		stream = fs.createReadStream(__dirname + '/script.js');
	}
	stream.pipe(res);
}).listen(process.env.PORT || 3000);
const http = require('http');
const fs = require('fs');
const configs = require('./config.js');
http.createServer(function (req, res) {
	var splitURL = req.url.split('?');
	var variablesGET, variablesPOST;
	if (req.method == 'POST') {
		var body = "";
		req.on('data', function (chunk) {
			body += chunk;
		});
		req.on('end', function () {
			variablesPOST = JSON.parse('{"'+(body.replace(/=/g,'":"')).replace(/&/g,'", "')+'"}');
			console.log(variablesPOST);
			serveFile();
		});
	} else {
		serveFile();
	}
	function serveFile() {
		if (typeof splitURL[1] != 'undefined') {
			variablesGET = JSON.parse('{"'+(splitURL[1].replace(/=/g,'":"')).replace(/&/g,'", "')+'"}');
		}
		if (splitURL[0] == "/") {
			splitURL[0] = "/"+configs.homepage;
		}
		var file = configs.htmlDir+splitURL[0].substr(1);
		fs.readFile(file, function(err, data){
			if (err) {
				res.writeHead(404, {'Content-Type': 'text/html'});
				res.write(configs.header);
				res.write(configs.fileNotFound);
				res.write(configs.footer);
				if (err.errno == -2 || err.errno == -20) {
					//console.log(err);
				} else {
					console.log(err);
				}
			} else {
				var fileExt = file.split(".")[1];
				var fileType;
				switch (fileExt) {
					case "html":
						fileType = "text";
						break;
					case "js":
						fileType = "application";
						fileExt = "javascript";
						break;
					case "jpg":
						fileType = "image";
						fileExt = "jpeg";
						break;
					default:
						fileType = "text";
				}
				res.writeHead(200, {'Content-Type': fileType+'/'+fileExt});
				if (fileExt == "html"){
					res.write(configs.header);
					res.write(data);
					res.write(configs.footer);
				} else {
					res.write(data);
				}
			}
			res.end();
		});
	}
}).listen(8080);
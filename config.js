//database
module.exports.dbuser = "dbAppUser";
module.exports.dbpass = "weakPassword";
module.exports.dbhost = "localhost";
module.exports.dbname = "dbname";
//html
module.exports.htmlDir = "html/";
module.exports.homepage = "index.html";
const fileNotFound = "404.html";
const header = "header.html";
const footer = "footer.html";
//configurables

//
const fs = require('fs');
fs.readFile(module.exports.htmlDir+fileNotFound, function(err, data){
	module.exports.fileNotFound = data;
});
fs.readFile(module.exports.htmlDir+header, function(err, data){
	module.exports.header = data;
});
fs.readFile(module.exports.htmlDir+footer, function(err, data){
	module.exports.footer = data;
});
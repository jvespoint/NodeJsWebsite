const mysql = require('mysql');
const fs = require('fs');
var con = mysql.createConnection({
	host: "localhost",
	user: "dbAppUser",
	password: "weakPassword"
});
con.connect(function(err) {
	if (err) throw err;
	console.log("MySQL connection successful.");
	if (process.argv[2] == "--setup"){
		if (typeof(process.argv[3]) == "undefined") throw "Must specify design json.";
		var designFile = process.argv[3];
		fs.readFile(designFile, (err, data) => {
			if (err) throw err;
			console.log("Loaded database design file: "+designFile)
			var design = JSON.parse(data);
			for(var database in design){
				console.log("Setting up database: "+database);
				con.query("CREATE DATABASE IF NOT EXISTS "+database, function (err, result) {
					if (err) throw err;
					//console.log(result);
					var conDB = mysql.createConnection({
						host: "localhost",
						user: "dbAppUser",
						password: "weakPassword",
						database: database
					});
					conDB.connect(function(err) {
						if (err) throw err;
						console.log("Switching to database: "+database);
						for (var table in design[database]){
							console.log("Building table: "+table)
							var tableQuery = 'CREATE TABLE '+table+' (';
							var i = 0;
							for (var column in design[database][table]){
								console.log("Adding column: "+column)
								if (i == 0){} else {
									tableQuery += ", ";
								}
								tableQuery += column+' '+design[database][table][column];
								i++;
							}
							tableQuery += ')';
							//console.log(tableQuery);
							conDB.query(tableQuery, function (err, result) {
								if (err) throw err;
								//console.log(result);
							});
						}
						conDB.end();
						console.log("Database connection closed.");
					});
				});
			}
		});
	} else if (process.argv[2] == "--reset"){
		con.query("SHOW DATABASES", function (err, result) {
			for (var i in result){
				switch (result[i].Database){
					case "information_schema":
						console.log("Keeping default database: "+result[i].Database);
						break;
					case "mysql":
						console.log("Keeping default database: "+result[i].Database);
						break;
					case "performance_schema":
						console.log("Keeping default database: "+result[i].Database);
						break;
					case "sys":
						console.log("Keeping default database: "+result[i].Database);
						break;
					default:
						console.log("Removing database: "+result[i].Database);
						con.query("DROP DATABASE "+result[i].Database, function (err, result) {
							if (err) throw err;
							//console.log(result);
						});
				}
			}
		});
	}
});
process.on('SIGINT', () => {
	console.log();
	console.info('Shutdown...');
	con.end();
	console.log("->SQL connections closed.")
});
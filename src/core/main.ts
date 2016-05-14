/// <reference path="_all.d.ts" />
(() => {
	"use strict";

	const path = require("path");
	let config = require('../config/config.json');
	config.serverRoot = path.join(__dirname, '../');
	const routes = require(config.serverRoot + 'config/routes.json');
	const fs = require("fs");
	const http = require('http');
	const https = require('https');
	const express = require('express');
	const exphbs = require('express-handlebars');
	const app = express();


	console.log(config.serverRoot);


	//set view engine
	if (config.handlebarsTemplateEngine) {
		app.set('views', config.serverRoot + '/views');
		
		const exphbsOptions = {
			defaultLayout: 'main',
			layoutsDir: config.serverRoot + '/views/layouts',
			partialsDir: config.serverRoot + '/views/partials',
			extname: ".view.html"
		};

		app.engine('.view.html', exphbs(exphbsOptions));
		app.set('view engine', '.view.html');
		app.enable('view cache');
	}

	//setting the static folder fo the app
	app.use(express.static(path.join(config.serverRoot, '../src/public')));


	//routing
	//loop through the routes.json file
	//connecting the right controller 
	//for each route and create it
	routes.forEach((route) => {
		const controller = require(config.serverRoot + '/controllers/' + route.controller + '.ctrl');
		let middlewares = [];

		//load middlewares if exist for this route
		if (typeof route.middlewares !== "undefined" && route.middlewares.length) {
			route.middlewares.forEach((midName) => {
				const m = require(config.serverRoot + '/middlewares/' + midName + '.mid.ts');
				middlewares.push(m);
			});
		}

		app.all(route.path, middlewares, controller);
	});


	//reducing the http header size 
	//by removing x-powered-by
	app.disable('x-powered-by');


	//set the http server
	if (config.httpServer) {
		const httpServer = http.createServer(app);
		httpServer.listen(config.httpPort, () => {
			console.log(`${config.appName} http server listening on port ${config.httpPort}`);
		});
	}


	//set the https server
	if (config.httpsServer) {
		const sslConfig = {
			key: fs.readFileSync(config.serverRoot + 'config/ssl/file.pem'),
			cert: fs.readFileSync(config.serverRoot + 'config/ssl/file.crt')
		};

		const httpsServer = https.createServer(sslConfig, app);

		httpsServer.listen(config.httpsPort, () => {
			console.log(`${config.appName} https server listening on port ${config.httpsPort}`);
		});
	}
})();
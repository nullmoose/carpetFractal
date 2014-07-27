#!/usr/bin/env node

// Setup ========================================================================
var express  = require('express'),
		config   = require('config'),
		app      = express(),
		path     = require('path'),
		server   = require('http').createServer(app);

// Configure Aapplication  ======================================================
app.configure(function() {
	app.use(express.logger());
	app.use(express.bodyParser());
  app.use(express.methodOverride());
	app.use(express.static('public'));
	app.use(app.router);
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});


// Routes =======================================================================
require('../config/routes')(app);


// Begin Listening ==============================================================
server.listen(5000, function(error) {
	if (error) {
    console.log("Unable to listen for connections: " + error);
    process.exit(10);
  }
 	console.log("Express is listening on port: " + 5000);
});

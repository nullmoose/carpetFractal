var path = require('path');

module.exports = function(app) {

	// Error Handling ===============================================================
	// app.use(function(err, req, res, next) {
	//   console.error(err.stack);
	//   res.send(500, 'Something broke!');
	// });

	console.log(require('app/routes/soundcloud'));

	require('app/routes/soundcloud')(app);

	// Application ==================================================================
	app.get('*', function(req, res) {
		res.sendfile('http://localhost:5000/public/index.html'); // Load the single view file (angular will handle the page changes on the front-end)
	});
};

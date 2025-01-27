const logger = require('./logger');

module.exports = function(app) {
	if (typeof app.channel !== 'function') {
		// If no real-time functionality has been configured just return
		return;
	}

	app.on('connection', connection => {
		app.channel('everyone').join(connection);
	});

	app.on('login', (authResult, { connection }) => {
		logger.debug('New login: ', authResult, connection);

		// connection can be undefined if there is no
		// real-time connection, e.g. when logging in via REST
		if (connection) {
			// Obtain the logged in user from the connection
			// const user = connection.user;

			// Add it to the authenticated user channel
			app.channel('authenticated').join(connection);
		}
	});

	// eslint-disable-next-line no-unused-vars
	app.publish((data, hook) => {
		// eslint-disable-line no-unused-vars
		// Publish all service events to all authenticated users
		return app.channel('authenticated');
	});
};

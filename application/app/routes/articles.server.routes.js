'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	articles = require('../../app/controllers/articles');

module.exports = function(app) {
	// Article Routes
	app.route('/articles')
		.get(articles.list)
		.post(users.requiresLogin, articles.create);

	app.route('/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
		.post(users.requiresLogin, articles.newVersion)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

	app.route('/articles/:articleId/activities')
		.get(articles.activities);

	app.route('/articles/:articleId/reviews')
		.get(articles.reviews);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};
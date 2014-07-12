'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Review = mongoose.model('Review'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Review already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Review
 */
exports.create = function(req, res) {
	var review = new Review(req.body);
	review.user = req.user;

	review.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(review);
		}
	});
};

/**
 * Show the current Review
 */
exports.read = function(req, res) {
	res.jsonp(req.review);
};

/**
 * Update a Review
 */
exports.update = function(req, res) {
	var review = req.review ;

	review = _.extend(review , req.body);

	review.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(review);
		}
	});
};

/**
 * Delete an Review
 */
exports.delete = function(req, res) {
	var review = req.review ;

	review.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(review);
		}
	});
};

/**
 * List of Reviews
 */
exports.list = function(req, res) { Review.find().sort('-created').populate('user', 'displayName').exec(function(err, reviews) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(reviews);
		}
	});
};

/**
 * Review middleware
 */
exports.reviewByID = function(req, res, next, id) { Review.findById(id).populate('user', 'displayName').exec(function(err, review) {
		if (err) return next(err);
		if (! review) return next(new Error('Failed to load Review ' + id));
		req.review = review ;
		next();
	});
};

/**
 * Review authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.review.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Article = mongoose.model('Article'),
	Review = mongoose.model('Review');

/**
 * Globals
 */
var user, article, review;

/**
 * Unit tests
 */
describe('Review Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		article = new Article({
			title: 'Article Title',
			content: 'Article Content',
			url: 'Article Url',
			authors: [{name:'Franck Lloyd Wright', url:''}, {name:'Rem Koolhaas', url:''}, {name:'Ludwig Mies Van Der Rohe', url:''}],
			format: 'Article Format',
			description: 'Article Description',
			language: 'Article Language',
			user: user
		});

		user.save(function() { 
			review = new Review({
				comment: 'Review comment',
				evaluations : {
					orthographe: true,
					a: true,
					b: true,
					c: false
				},
				article: article,
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return review.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		/*it('should be able to show an error when try to save without evaluations', function(done) { 
			delete activity.evaluations;
			return activity.save(function(err) {
				should.exist(err);
				done();
			});
		});*/
	});

	afterEach(function(done) { 
		Review.remove().exec();
		User.remove().exec();

		done();
	});
});
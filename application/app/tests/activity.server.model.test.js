'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Article = mongoose.model('Article'),
	Activity = mongoose.model('Activity');

/**
 * Globals
 */
var user, article, activity;

/**
 * Unit tests
 */
describe('Activity Model Unit Tests:', function() {
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
			activity = new Activity({
				story: 'Voila l\'histoire',
				action: 'CREATE',	   
				article: article,
				user: user		
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return activity.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without story', function(done) { 
			activity.story = '';
			return activity.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Activity.remove().exec();
		User.remove().exec();

		done();
	});
});
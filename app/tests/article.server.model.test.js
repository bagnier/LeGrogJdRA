'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Article = mongoose.model('Article');

/**
 * Globals
 */
var user, article;

/**
 * Unit tests
 */
describe('Article Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			article = new Article({
				title: 'Article Title',
				content: 'Article Content',
				url: 'Article Url',
				authors: [{name:'Franck Lloyd Wright', url:''}, {name:'Rem Koolhaas', url:''}, {name:'Ludwig Mies Van Der Rohe', url:''}],
				tags: ['grand', 'beau'],
				format: 'Article Format',
				description:  'Article Description',
				language:  'Article Language',
				user: user
			});

			done();
		});
	});


	describe('authorsCommaSeparated helper method', function() {
		it('should be able to inline the author names to a string', function() {
			article.authorsCommaSeparated.should.eql('Franck Lloyd Wright;Rem Koolhaas;Ludwig Mies Van Der Rohe');
		});

		it('should be able to setup the author names from a string', function() {
			article.authors = [];
			article.authorsCommaSeparated = 'Franck Lloyd Wright;Rem Koolhaas;Ludwig Mies Van Der Rohe';
			article.authors.should.be.instanceof(Array).and.have.lengthOf(3);
			var authorNames = [];
			for (var author in article.authors) {
				authorNames += article.authors[author].name;
			}
			authorNames.should.containEql('Franck Lloyd Wright');
			authorNames.should.containEql('Rem Koolhaas');
			authorNames.should.containEql('Ludwig Mies Van Der Rohe');
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return article.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			article.title = '';
			return article.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Article.remove().exec();
		User.remove().exec();
		done();
	});
});
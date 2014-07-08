'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	authors: [{
		name: {
			type: String,
			default: '',
			trim: true,
		},
		url: {
			type: String,
			default: '',
			trim: true,
		}
	}],
	url: {
		type: String,
		default: '',
		trim: true
	},
	format: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	language: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

// this is an incomplete implementation
ArticleSchema.virtual('authorsCommaSeparated')
.get(function () {
	var authorNames = [];
	for (var i = 0; i < this.authors.length; i++) {
		authorNames.push(this.authors[i].name);
	}
  return authorNames.join(';');

})
.set(function (authorsCommaSeparated) {
  	var authorNames = authorsCommaSeparated.split(';');
  	var authors = [];
  	for (var i in authorNames) {
		authors.push({name:authorNames[i], url:''});
	}
  	this.set('authors', authors);
});

ArticleSchema.set('toJSON', { virtuals: true });

mongoose.model('Article', ArticleSchema);
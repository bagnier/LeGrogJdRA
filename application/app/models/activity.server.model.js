'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Activity Schema
 */
var ActivitySchema = new Schema({
	story: {
		type: String,
		default: '',
		required: 'Please fill Activity story',
		trim: true
	},
	action: {
		type: String,
		default: '',
		required: 'Please fill Activity action',
		trim: true
	},
	article: {
		type: Schema.ObjectId,
		ref: 'Article'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Activity', ActivitySchema);
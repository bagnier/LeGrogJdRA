'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Review Schema
 */
var ReviewSchema = new Schema({
	
	comment: {
		type: String,
		default: '',
		required: 'Please fill Review comment',
		trim: true
	},
	evaluations: {
		orthographe: {
			type: Boolean,
			default: false
		},
		a: {
			type: Boolean,
			default: false
		},
		b: {
			type: Boolean,
			default: false
		},
		c: {
			type: Boolean,
			default: false
		}
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

mongoose.model('Review', ReviewSchema);
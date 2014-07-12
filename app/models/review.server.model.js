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
		spelling: {
			type: Boolean,
			default: false
		},
		content: {
			type: Boolean,
			default: false
		},
		shape: {
			type: Boolean,
			default: false
		},
		neutrality: {
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
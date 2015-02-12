'use strict';

//Reviews service used to communicate Reviews REST endpoints
angular.module('reviews').factory('Reviews', ['$resource',
	function($resource) {
		return $resource('reviews/:reviewId', { reviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
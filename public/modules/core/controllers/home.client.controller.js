'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Activities',
	function($scope, Authentication, Activities) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.activities = Activities.query();
	}
]);
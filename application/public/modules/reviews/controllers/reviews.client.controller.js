'use strict';

// Reviews controller
angular.module('reviews').controller('ReviewsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reviews', 'Articles', 'Activities',
	function($scope, $stateParams, $location, Authentication, Reviews, Articles, Activities ) {
		$scope.authentication = Authentication;

		$scope.initFromArticle = function() {
			var searchObject = $location.search();
			$scope.articleId = searchObject.articleId;

			$scope.prerender = Articles.get({
				articleId: $scope.articleId
			}, function() {
				$scope.prerender.noUrl = ($scope.url !== '');
			});
		};

		// Create new Review
		$scope.create = function() {
			// Create new Review object
			var review = new Reviews ({
				comment: this.comment,
				evaluations: this.evaluations,
				article: $scope.articleId
			});

			// Redirect after save
			review.$save(function(response) {
				var activity = new Activities ({
					story: 'vient de commenter la nouvelle fiche',
					action: 'article.review',
					article: $scope.articleId
				});

				activity.$save(function(response) {
					$location.path('articles/' + $scope.articleId);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			//this.comment = '';
			//this.evaluations = {};
		};

		// Remove existing Review
		$scope.remove = function( review ) {
			if ( review ) { review.$remove();

				for (var i in $scope.reviews ) {
					if ($scope.reviews [i] === review ) {
						$scope.reviews.splice(i, 1);
					}
				}
			} else {
				$scope.review.$remove(function() {
					$location.path('reviews');
				});
			}
		};

		// Update existing Review
		$scope.update = function() {
			var review = $scope.review ;

			review.$update(function() {
				$location.path('reviews/' + review._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reviews
		$scope.find = function() {
			$scope.reviews = Reviews.query();
		};

		// Find existing Review
		$scope.findOne = function() {
			$scope.review = Reviews.get({ 
				reviewId: $stateParams.reviewId
			});
		};

		$scope.createVersion = function() {
			$location.search({comment: $scope.comment});
			$location.path('articles/' + $scope.articleId + '/version');
		};
	}
	]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles', 'Activities',
	function($scope, $stateParams, $location, Authentication, Articles, Activities) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				url: this.url,
				format: this.format,
				description: this.description,
				language: this.language,
				authorsCommaSeparated: this.authorsCommaSeparated

			});
			article.$save(function(response) {
				var articleId = response._id;
				var activity = new Activities ({
					story: $scope.authentication.user.displayName + ' vient de capturer une nouvelle fiche intitulée ' + article.title,
					action: 'article.create',
					article: articleId
				});

				activity.$save(function(response) {
					$location.path('articles/' + articleId);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			this.title = '';
			this.url = '';
			this.format = '';
			this.description = '';
			this.language = '';
			this.authorsCommaSeparated = '';

		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
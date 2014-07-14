'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles', 'Activities', 'Reviews', 
	function($scope, $stateParams, $location, Authentication, Articles, Activities, Reviews) {
		$scope.authentication = Authentication;

		$scope.render = function() {

			var authorsConverter = function(authorsCommaSeparated) {
				var authors = [];
				if (authorsCommaSeparated) {
					var authorNames = authorsCommaSeparated.split(';');
				  	for (var i in authorNames) {
						authors.push({name:authorNames[i], url:''});
					}
				}
				return authors;
			};

			$scope.prerender = {
				ok: true,
				title: $scope.title,
				url: $scope.url,
				noUrl: ($scope.url !== ''),
				format: $scope.format,
				description: $scope.description,
				language: $scope.language,
				authors: authorsConverter($scope.authorsCommaSeparated),
				tags: $scope.tagsCommaSeparated ? $scope.tagsCommaSeparated.split(';') : []
			};
		};

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				url: this.url,
				format: this.format,
				description: this.description,
				language: this.language,
				authorsCommaSeparated: this.authorsCommaSeparated,
				tags: this.tagsCommaSeparated ? this.tagsCommaSeparated.split(';') : []
			});
			article.$save(function(response) {
				var articleId = response._id;
				var activity = new Activities ({
					story: 'vient de capturer la nouvelle fiche',
					action: 'article.create',
					article: articleId
				});

				activity.$save(function(response) {
					var review = new Reviews ({
						evaluations: $scope.evaluations,
						comment: $scope.comment,
						article: articleId
					});

					review.$save(function(response) {
						$location.path('articles/' + articleId);
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			/*this.title = '';
			this.url = '';
			this.format = '';
			this.description = '';
			this.language = '';
			this.authorsCommaSeparated = '';
			this.tagsCommaSeparated = '';*/
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
			article.tags = article.tagsCommaSeparated.split(';');
			delete article.tagsCommaSeparated;

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
			}, function() {
				if ($scope.article.tags) 
					$scope.article.tagsCommaSeparated = $scope.article.tags.join(';');
			});
		};

		$scope.findOneArticleAndRelatedActivities = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			}, function() {
				$scope.article.noUrl = (!$scope.article.url) || ($scope.article.url === 'NULL');
			});
			$scope.activities = Articles.findActivities({
				articleId: $stateParams.articleId
			});
		};
	}
]);
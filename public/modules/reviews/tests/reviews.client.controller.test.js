'use strict';

(function() {
	// Reviews Controller Spec
	describe('Reviews Controller Tests', function() {
		// Initialize global variables
		var ReviewsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same comment as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Reviews controller.
			ReviewsController = $controller('ReviewsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Review object fetched from XHR', inject(function(Reviews) {
			// Create sample Review using the Reviews service
			var sampleReview = new Reviews({
				comment: 'New Review',
				evaluations: {
					spelling: true,
					content: true,
					shape: true,
					neutrality: false
				}
			});

			// Create a sample Reviews array that includes the new Review
			var sampleReviews = [sampleReview];

			// Set GET response
			$httpBackend.expectGET('reviews').respond(sampleReviews);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reviews).toEqualData(sampleReviews);
		}));

		it('$scope.findOne() should create an array with one Review object fetched from XHR using a reviewId URL parameter', inject(function(Reviews) {
			// Define a sample Review object
			var sampleReview = new Reviews({
				comment: 'New Review',
				evaluations: {
					spelling: true,
					content: true,
					shape: true,
					neutrality: false
				}
			});

			// Set the URL parameter
			$stateParams.reviewId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/reviews\/([0-9a-fA-F]{24})$/).respond(sampleReview);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.review).toEqualData(sampleReview);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Reviews, Activities) {
			scope.articleId = '525cf20451979dea2c000002';

			// Create a sample Review object
			var sampleReviewPostData = new Reviews({
				comment: 'New Review',
				evaluations: {
					spelling: true,
					content: true,
					shape: true,
					neutrality: false
				},
				article:scope.articleId
			});

			// Create a sample Review response
			var sampleReviewResponse = new Reviews({
				_id: '525cf20451979dea2c000001',
				comment: 'New Review',
				evaluations: {
					spelling: true,
					content: true,
					shape: true,
					neutrality: false
				},
				article:scope.articleId
			});

			// Create a sample activity object
			var sampleActivityPostData = new Activities({
				story:'vient de commenter la nouvelle fiche',
				action:'article.review',
				article:scope.articleId
			});

			// Create a sample activity response
			var sampleActivityResponse = new Activities({
				_id: '525cf20451979dea2c000002',
				story:'vient de commenter la nouvelle fiche',
				action:'article.review',
				article:scope.articleId
			});

			// Fixture mock form input values
			scope.comment = 'New Review';
			scope.evaluations = {
				spelling: true,
				content: true,
				shape: true,
				neutrality: false
			};

			// Set POST response
			$httpBackend.expectPOST('reviews', sampleReviewPostData).respond(sampleReviewResponse);
			$httpBackend.expectPOST('activities', sampleActivityPostData).respond(sampleActivityResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			//expect(scope.comment).toEqual('');

			// Test URL redirection after the Review was created
			expect($location.path()).toBe('/articles/' + scope.articleId);
		}));

		it('$scope.update() should update a valid Review', inject(function(Reviews) {
			// Define a sample Review put data
			var sampleReviewPutData = new Reviews({
				_id: '525cf20451979dea2c000001',
				comment: 'New Review',
				evaluations: {
					spelling: true,
					content: true,
					shape: true,
					neutrality: false
				}
			});

			// Mock Review in scope
			scope.review = sampleReviewPutData;

			// Set PUT response
			$httpBackend.expectPUT(/reviews\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/reviews/' + sampleReviewPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid reviewId and remove the Review from the scope', inject(function(Reviews) {
			// Create new Review object
			var sampleReview = new Reviews({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Reviews array and include the Review
			scope.reviews = [sampleReview];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/reviews\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleReview);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.reviews.length).toBe(0);
		}));
	});
}());
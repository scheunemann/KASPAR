'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./interaction.tpl.html');

	var Interaction = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				teacher : '=',
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.reset = function() {
					$scope.user = undefined;
					$scope.selectedGames = undefined;
					$scope.interaction = undefined;
				};

				$scope.reset();

				$scope.$watch('user', function(user) {
					if (user) {
						$scope.setSelectGames();
					} else {
						$scope.setSelectUser();
					}
				});

				$scope.setConfirmGames = function() {
					$scope.state = 'beginInteraction';
				};

				$scope.setSelectUser = function() {
					$scope.state = 'selectUser';
				};
				
				$scope.setSelectGames = function() {
					$scope.state = 'selectGames';
				};
				
				$scope.setStartInteraction = function() {
					$scope.state = 'activeInteraction';
				};
				
				$scope.setReviewInteraction = function() {
					$scope.state = 'endInteraction';
				};
			}
		};
	};

	return Interaction;
});

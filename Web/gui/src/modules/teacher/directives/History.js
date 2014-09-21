'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./history.tpl.html');

	var History = function(userService, interactionService) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				teacher : '=',
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.users = userService.getUsers();
				$scope.interactions = interactionService.getInteractions();
				
				$scope.colors = ['bad', 'moderate_bad', 'neutral', 'moderate_good', 'good'];

				$scope.select = function(interaction) {
					$scope.selectedInteraction = interaction;
				}
				
				$scope.userFilter = function(element) {
					return $scope.selectedUser === element && element.user && element.user.name == $scope.selectedUser.name;
				}
			}
		};
	};

	return [ 'userService', 'interactionService', History ];
});

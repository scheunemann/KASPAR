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
				
				$scope.colors = ['red', 'orange', 'yellow', 'blue', 'green'];

				$scope.select = function(interaction) {
					$scope.selectedInteraction = interaction;
				}
				
				$scope.userFilter = function(element) {
					if ($scope.selectedUser) {
						if (element && element.child) {
							return element.child.name == $scope.selectedUser.name;
						} else {
							return false;
						}
					} else {
						return true;
					}
				}
			}
		};
	};

	return [ 'userService', 'interactionService', History ];
});

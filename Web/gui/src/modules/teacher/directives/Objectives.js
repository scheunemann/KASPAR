'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./objectives.tpl.html');

	var Objectives = function(objectiveService, gameService, scenarioService) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				teacher : '='
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.objectives = objectiveService.getObjectives();
				$scope.items = [];
				$scope.items.push.apply($scope.items, gameService.getGames());
				$scope.items.push.apply($scope.items, scenarioService.getScenarios());

				$scope.selectObjective = function(objective) {
					$scope.selectedObjective = objective;
				};

				$scope.itemFilter = function(element) {
					if (element && element.objectives && $scope.selectedObjective) {
						for (var i = 0; i < element.objectives.length; i++) {
							if (element.objectives[i].key == $scope.selectedObjective.key) { return true; }
						}
					}

					return false;
				}
			}
		};
	};

	return [ 'objectiveService', 'gameService', 'scenarioService', Objectives ];
});

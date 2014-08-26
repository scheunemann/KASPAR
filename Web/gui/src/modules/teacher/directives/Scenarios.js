'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./scenarios.tpl.html');
	require('teacher/services/dataProvider');

	var Scenarios = function(scenarioService) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				teacher : '=',
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.scenarios = scenarioService.getScenarios();

				$scope.selectScenario = function(scenario) {
					$scope.selectedScenario = scenario;
				};

				$scope.teacherScenarios = function(element) {
					if (element && element.author && $scope.teacher) {
						return element.author.name == $scope.teacher.name;
					} else {
						return false;
					}
				};

				$scope.shouldHighlight = function(scenario, tag, objective) {
					if ((tag || objective) && scenario != $scope.selectedScenario) {
						var hasTag = tag === undefined || tag === null;
						if (scenario.tags && tag) {
							for (var i = 0; i < scenario.tags.length; i++) {
								if (scenario.tags[i].key == tag.key) {
									hasTag = true;
								}
							}
						}

						var hasObj = objective === undefined || objective === null;
						if (scenario.objectives && objective) {
							for (var i = 0; i < scenario.objectives.length; i++) {
								if (scenario.objectives[i].key == objective.key) {
									hasObj = true;
								}
							}
						}

						return hasTag & hasObj;
					} else {
						return false;
					}
				};
			}
		};
	};

	return [ 'scenarioService', Scenarios ];
});

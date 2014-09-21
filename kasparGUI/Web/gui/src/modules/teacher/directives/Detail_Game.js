'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./detail_game.tpl.html');

	var Detail_Game = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				game : "=",
				selectedObjective : "=",
				selectedTag : "="
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.toggleTag = function(tag) {
					if ($scope.selectedTag === null || $scope.selectedTag === undefined) {
						$scope.selectedTag = tag;
					} else if ($scope.selectedTag.key == tag.key) {
						$scope.selectedTag = null;
					} else {
						$scope.selectedTag = tag;
					}
				}

				$scope.toggleObjective = function(objective) {
					if ($scope.selectedObjective === null || $scope.selectedObjective === undefined) {
						$scope.selectedObjective = objective;
					} else if ($scope.selectedObjective.key == objective.key) {
						$scope.selectedObjective = null;
					} else {
						$scope.selectedObjective = objective;
					}
				}
			}
		};
	};

	return Detail_Game;
});

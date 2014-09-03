'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./objectives.tpl.html');

	var Objectives = function(objectiveService, tagService, gameService) {
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
				$scope.tags = tagService.getTags();
				$scope.items = [];
				$scope.items.push.apply($scope.items, gameService.getGames());

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

				$scope.selectGame = function(game) {
					if ($scope.selectedGame == game) {
						$scope.selectedGame = undefined;
					} else {
						$scope.selectedGame = game;
					}
				};

				$scope.itemFilter = function(element) {
					var objective = false;
					if ($scope.selectedObjective) {
						if (element && element.objectives) {
							for (var i = 0; i < element.objectives.length; i++) {
								if (element.objectives[i].key == $scope.selectedObjective.key) {
									objective = true;
									break;
								}
							}
						}
					} else {
						objective = true;
					}

					var tag = false;
					if ($scope.selectedTag) {
						if (element && element.tags) {
							for (var i = 0; i < element.tags.length; i++) {
								if (element.tags[i].key == $scope.selectedTag.key) {
									tag = true;
									break;
								}
							}
						}
					} else {
						tag = true;
					}

					return tag && objective;
				}
			}
		};
	};

	return [ 'objectiveService', 'tagService', 'gameService', Objectives ];
});

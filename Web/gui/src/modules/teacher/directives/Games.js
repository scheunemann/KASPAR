'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./games.tpl.html');
	require('teacher/services/dataProvider');

	var Games = function(gameService) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				teacher : '='
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.games = gameService.getGames();

				$scope.selectGame = function(game) {
					if ($scope.selectedGame == game) {
						$scope.selectedGame = undefined;
					} else {
						$scope.selectedGame = game;
					}
				};
				
				$scope.teacherGames = function(element) {
					if (element && element.author && $scope.teacher) {
						return element.author.name == $scope.teacher.name;
					} else {
						return false;
					}
				};

				$scope.shouldHighlight = function(game, objective) {
					if (objective && game != $scope.selectedGame) {
						var hasObj = objective === undefined || objective === null;
						if (game.objectives && objective) {
							for (var i = 0; i < game.objectives.length; i++) {
								if (game.objectives[i].key == objective.key) {
									hasObj = true;
								}
							}
						}

						return hasObj;
					} else {
						return false;
					}
				};
			}
		};
	};

	return [ 'gameService', Games ];
});

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
					$scope.selectedGame = game;
				};

				$scope.shouldHighlight = function(game, tag, objective) {
					if (tag || objective) {
						var hasTag = tag === undefined || tag === null;
						if (game.tags && tag) {
							for (var i = 0; i < game.tags.length; i++) {
								if (game.tags[i].key == tag.key) {
									hasTag = true;
								}
							}
						}

						var hasObj = objective === undefined || objective === null;
						if (game.objectives && objective) {
							for (var i = 0; i < game.objectives.length; i++) {
								if (game.objectives[i].key == objective.key) {
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

	return [ 'gameService', Games ];
});

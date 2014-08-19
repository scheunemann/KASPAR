'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./activeInteraction.tpl.html');

	var ActiveInteraction = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				interaction : '=',
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.changeGame = function(game) {
					if ($scope.selectedGame && $scope.selectedGame.started && !$scope.selectedGame.finished) {
						alert('Please finish current game first!');
					} else {
						$scope.selectedGame = game;
					}
				};

				$scope.endInteraction = function() {
					if ($scope.selectedGame && $scope.selectedGame.started && !$scope.selectedGame.finished) {
						alert('Please finish current game first!');
					} else {
						$scope.interaction.totalTime = '30m';
						var games = $scope.interaction.games.slice(0);
						for (var i = 0; i < games.length; i++) {
							if (!games[i].started) {
								$scope.interaction.games.splice($scope.interaction.games.indexOf(games[i]), 1);
							}
						}
					}
				};
			}
		};
	};

	return ActiveInteraction;
});

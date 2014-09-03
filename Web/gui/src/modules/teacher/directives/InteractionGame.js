'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./interactionGame.tpl.html');

	var InteractionGame = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				game : '=',
				interaction : '=',
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.showStart = true;
				var startTime = null;
				
				$scope.start = function() {
					$scope.game.started = true;
					$scope.game.finished = false;
					startTime = Date.now();
					$scope.showStart = false;
				};

				$scope.end = function() {
					$scope.game.finished = true;
					$scope.showStart = true;
					
					var playTime = Date.now() - startTime;
					startTime = null;
					var min = Math.round(playTime / 60000, 0);
					var sec = Math.round(playTime % 60000 / 1000, 0);
					
					$scope.interaction.games.push({
						name : $scope.game.name,
						thumbsrc : $scope.game.thumbsrc,
						fullsrc : $scope.game.fullsrc,
						totTime: min + "m" + sec + "s" 
					});
				};
			}
		};
	};

	return InteractionGame;
});

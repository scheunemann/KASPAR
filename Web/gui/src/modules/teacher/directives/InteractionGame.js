'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./interactionGame.tpl.html');

	var InteractionGame = function(interactionService, InteractionGame) {
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
				$scope.start = function() {
					var activeGame = interactionService.getCurrentGame();
					if (activeGame) {
						alert("Please finish Play Scenario " + activeGame.name + " first.");
						return;
					}
					
					interactionService.startNewGame(game);					
				};

				$scope.end = function() {
					interactionService.endGame(game);
				};
			}
		};
	};

	return [ 'interactionService', 'InteractionGame', InteractionGame ];
});

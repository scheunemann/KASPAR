'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./activeInteraction.tpl.html');

	var ActiveInteraction = function(interactionService) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				interaction : '=',
				user : '=',
				games: '=',
				onFinished : '=?',
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.changeGame = function(game) {
					$scope.selectedGame = game;
				};

				$scope.endInteraction = function() {
					if (interactionService.getCurrentGame()) {
						alert('Please finish current game first!');
					} else {
						interactionService.finishInteraction();
						if ($scope.onFinished) {
							$scope.onFinished();
						}
					}
				};
			}
		};
	};

	return ['interactionService', ActiveInteraction];
});

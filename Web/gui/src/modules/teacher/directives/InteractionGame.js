'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./interactionGame.tpl.html');

	var InteractionGame = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				game: '=',
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {				
				$scope.start = function() {
					$scope.game.started = true;
				};
				
				$scope.end = function() {
					$scope.game.finished = true;
				};
			}
		};
	};

	return InteractionGame;
});

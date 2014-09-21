'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./detail_history.tpl.html');

	var Detail_History = function(interactionService) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				interaction : "=",
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.images = [ 'bad.png', 'moderate_bad.png', 'neutral.png', 'moderate_good.png', 'good.png' ];
				$scope.colors = ['bad', 'moderate_bad', 'neutral', 'moderate_good', 'good'];

				$scope.addNote = function() {
					noteService.addNote('', $scope.interaction.notes);
				}
				
				$scope.getObjectives = function() {
					return interactionService.getObjectives($scope.interaction);
				}
			}
		};
	};

	return ['interactionService', Detail_History];
});

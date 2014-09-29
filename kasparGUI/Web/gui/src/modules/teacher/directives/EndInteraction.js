'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./endInteraction.tpl.html');

	var EndInteraction = function(interactionService, noteService, $modal, Note) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				interaction : '=',
				user : '=',
				onFinished : '=?',
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.images = [ 'bad.png', 'moderate_bad.png', 'neutral.png', 'moderate_good.png', 'good.png' ];
				$scope.colors = [ 'bad', 'moderate_bad', 'neutral', 'moderate_good', 'good' ];
				$scope.getObjectives = function() {
					return interactionService.getObjectives($scope.interaction);
				}

				$scope.finish = function() {
					if ($scope.interaction.score.child.experience && $scope.interaction.score.child.engagement && $scope.interaction.score.parent.experience) {
						interactionService.endInteraction($scope.interaction);
						if ($scope.onFinished) {
							$scope.onFinished();
						}
					} else {
						alert('Please report your experience by clicking on the images');
					}
				};

				$scope.addNote = function(title) {
					noteService.addNote(title, $scope.interaction.notes);
				}

				$scope.getAverageScore = function(interaction) {
				    return Math.round((interaction.childEngagement + interaction.childExperience - 2) / 2);
				}
			}
		};
	};

	return ['interactionService', 'noteService', '$modal', 'Note', EndInteraction];
});

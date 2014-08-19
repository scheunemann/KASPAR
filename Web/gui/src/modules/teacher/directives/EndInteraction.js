'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./endInteraction.tpl.html');

	var EndInteraction = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				interaction : '='
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.images = [ '0.png', '1.png', '2.png', '3.png', '4.png' ];

				$scope.finish = function() {
					if ($scope.interaction.score.child.experience && $scope.interaction.score.child.engagement && $scope.interaction.score.parent.experience) {
						$scope.interaction.score.total = Math
								.round(($scope.interaction.score.child.experience + $scope.interaction.score.child.engagement + $scope.interaction.score.parent.experience) / 3);
						$scope.interaction = undefined;
					} else {
						alert('Please report your experience by clicking on the images');
					}
				};

				$scope.getObjectives = function() {
					var objectives = [];
					if ($scope.interaction && $scope.interaction.games) {
						for (var i = 0; i < $scope.interaction.games.length; i++) {
							if ($scope.interaction.games[i].objectives) {
								for (var j = 0; j < $scope.interaction.games[i].objectives.length; j++) {
									var found = false;
									for (var k = 0; k < objectives.length; k++) {
										if (objectives[k].key == $scope.interaction.games[i].objectives[j].key) {
											found = true;
											break;
										}
									}
									if (!found) {
										objectives.push($scope.interaction.games[i].objectives[j]);
									}
								}
							}
						}
					}

					return objectives;
				};
			}
		};
	};

	return EndInteraction;
});

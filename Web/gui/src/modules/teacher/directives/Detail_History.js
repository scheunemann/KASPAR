'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./detail_history.tpl.html');

	var Detail_History = function() {
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
				
				$scope.newNote = {
					title : 'Click to add a new Note'
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

	return Detail_History;
});
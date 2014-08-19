'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./beginInteraction.tpl.html');

	var BeginInteraction = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				teacher : '=',
				user : '=',
				games : '=',
				interaction : '=',
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.getObjectives = function() {
					var objectives = [];
					if ($scope.games) {
						for (var i = 0; i < $scope.games.length; i++) {
							if ($scope.games[i].objectives) {
								for (var j = 0; j < $scope.games[i].objectives.length; j++) {
									var found = false;
									for (var k = 0; k < objectives.length; k++) {
										if (objectives[k].key == $scope.games[i].objectives[j].key) {
											found = true;
											break;
										}
									}
									if (!found) {
										objectives.push($scope.games[i].objectives[j]);
									}
								}
							}
						}
					}

					return objectives;
				};

				$scope.start = function() {
					$scope.interaction = {
						date : '13/4/2014',
						totalTime : '',
						score : {
							'total' : 0,
							'parent' : {
								'experience' : 0,
							},
							'child' : {
								'experience' : 0,
								'engagement' : 0
							}
						},
						games : $scope.games.slice(0),
						notes : [],
						user : $scope.user
					};
				}
			}
		};
	};

	return BeginInteraction;
});

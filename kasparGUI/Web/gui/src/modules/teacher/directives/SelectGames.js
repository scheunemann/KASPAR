'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./selectGames.tpl.html');
	require('teacher/services/dataProvider');

	var Games = function(gameService) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				teacher : '=',
				user : '=',
				selectedGames : '=',
				onFinished : '=?',
				onCanceled : '=?',
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
				$scope.selected = [];
				$scope.games = gameService.getGames();

				$scope.confirmGames = function() {
					$scope.selectedGames = $scope.selected;
					if ($scope.onFinished) {
						$scope.onFinished();
					}
				};

				$scope.$watch('user.objectives', function(objectives) {
					$scope.selected = [];
					if (objectives !== null && objectives !== undefined && $scope.games) {
						for (var i = 0; i < $scope.games.length; i++) {
							if ($scope.itemFilter($scope.games[i])) {
								$scope.selected.push($scope.games[i]);
							}
						}
					}
				});

				$scope.itemFilter = function(element) {
					if (element && element.objectives && $scope.user && $scope.user.objectives) {
						for (var i = 0; i < element.objectives.length; i++) {
							for (var j = 0; j < $scope.user.objectives.length; j++) {
								if (element.objectives[i].tag == $scope.user.objectives[j].tag) { return true; }
							}
						}
					}

					return false;
				};

				$scope.selectGame = function(game) {
					if (!$scope.selected) {
						$scope.selected = [];
					}

					for (var i = 0; i < $scope.selected.length; i++) {
						if ($scope.selected[i] == game) {
							$scope.selected.splice(i, 1);
							return;
						}
					}

					$scope.selected.push(game);
				};
				
				$scope.back = function() {
					if ($scope.onCanceled) {
						$scope.onCanceled();
					}
				};
				
				$scope.isSelected = function(game) {
					if ($scope.selected) {
						for (var i = 0; i < $scope.selected.length; i++) {
							if ($scope.selected[i] == game) { return true; }
						}
					}
					return false;
				};
			}
		};
	};

	return [ 'gameService', Games ];
});

'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./groupEditor.tpl.html');

	var GroupEditor = function(language) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				group : "=action",
				actions : "=",
			},
			controller : function($scope) {
				$scope.language = language.getText();

				$scope.$watch('group', function(group) {
					if (group !== undefined && group.actions === undefined) {
						group.actions = [];
					}
				});

				$scope.addActions = function(actions) {
					for (var i = 0; i < actions.length; i++) {
						$scope.group.actions.push({name:actions[i].name, id:actions[i].id});
					}

					for(var j = 0; j < $scope.group.actions.length; j++) {
						$scope.group.actions[j].speedModifier = undefined;
					}

					$scope.group.$save();
				};

				$scope.removeActions = function(actions) {
					for (var i = 0; i < actions.length; i++) {
						$scope.group.actions.splice($scope.group.actions.indexOf(actions[i]), 1);
					}

					$scope.group.$save();
				};
			},
		};
	};

	return [ 'language', GroupEditor ];
});

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
				$scope.addActions = function(actions) {
					if ($scope.group.actions === undefined) {
						$scope.group.actions = [];
					}

					for (var i = 0; i < actions.length; i++) {
						$scope.group.actions.push(actions[i]);
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

	return ['language', GroupEditor];
});

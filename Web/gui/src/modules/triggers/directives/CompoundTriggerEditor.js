'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./compoundTriggerEditor.tpl.html');

	var CompoundTriggerEditor = function(language) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				compound : "=trigger",
				actions : "=",
				triggers : "=",
			},
			link : function(scope, iElement, iAttrs, controller) {
			},
			controller : function($scope) {
				$scope.language = language.getText();
				$scope.$watch('compound', function(compound) {
					if (compound !== undefined && compound.triggers === undefined) {
						compound.triggers = [];
					}
				});

				$scope.addTriggers = function(triggers) {
					for (var i = 0; i < triggers.length; i++) {
						$scope.compound.triggers.push(triggers[i]);
					}

					if ($scope.compountTriggerForm.$valid) {
						$scope.compound.$save();
					}
				};

				$scope.removeTriggers = function(triggers) {
					for (var i = 0; i < triggers.length; i++) {
						$scope.compound.triggers.splice($scope.compound.triggers.indexOf(triggers[i]), 1);
					}

					if ($scope.compountTriggerForm.$valid) {
						$scope.compound.$save();
					}
				};
			},
		};
	};

	return ['language', CompoundTriggerEditor];
});

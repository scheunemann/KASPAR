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
				$scope.addTriggers = function(triggers) {
					if ($scope.compound.triggers === undefined) {
						$scope.compound.triggers = [];
					}

					for (var i = 0; i < triggers.length; i++) {
						$scope.compound.triggers.push(triggers[i]);
					}

					save();
				};

				var save = function() {
					var selfIndex = -1;
					if ($scope.compound.id !== undefined) {
						for (var i = 0; i < $scope.compound.triggers.length; i++) {
							if ($scope.compound.triggers[i].id === $scope.compound.id) {
								selfIndex = i;
								break;
							}
						}
					} else {
						selfIndex = $scope.compound.triggers.indexOf($scope.compound);
					}

					$scope.compound.mustStayActive = true;
					$scope.compound.time = 0;
					$scope.compound.variance = 0;
					$scope.compound.$save();
				};

				$scope.removeTriggers = function(triggers) {
					for (var i = 0; i < triggers.length; i++) {
						$scope.time.triggers.splice($scope.time.triggers.indexOf(triggers[i]), 1);
					}

					save();
				};

			},
		};
	};

	return ['language', CompoundTriggerEditor];
});

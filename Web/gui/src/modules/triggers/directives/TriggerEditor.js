'use strict';

define(function(require) {
	var angular = require('angular');

	var TriggerEditor = function($compile) {
		return {
			restrict : 'E',
			scope : {
				type : "=",
				trigger : "=",
				triggers : "=",
				actions : "=",
			},
			link : function(scope, iElement, iAttrs, controller) {
				scope.$watch('type', function(newType) {
					if (newType != "" && newType != undefined) {
						iElement.html('<' + newType + '-editor trigger="trigger" triggers="triggers" actions="actions"></' + newType + '-editor>');
						$compile(iElement.contents())(scope);
					} else {
						iElement.html('');
						$compile(iElement.contents())(scope);
					}
				});
			},
			controller : function($scope) {
				$scope.$watch('trigger', function(trigger) {
					if (trigger != undefined) {
						$scope.trigger = trigger.getConcreteClassInstance();
					}
				});
			}
		};
	};

	return [ '$compile', TriggerEditor ];
});

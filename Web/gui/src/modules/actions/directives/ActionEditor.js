'use strict';

define(function(require) {
	var angular = require('angular');

	var ActionEditor = function($compile) {
		return {
			restrict : 'E',
			scope : {
				type : "=",
				action : "=",
				actions : "=",
			},
			link : function(scope, iElement, iAttrs, controller) {
				scope.$watch('type', function(newType) {
					if (newType != "" && newType != undefined) {
						iElement.html('<' + newType + '-editor action="action" actions="actions"></' + newType + '-editor>');
						$compile(iElement.contents())(scope);
					} else {
						iElement.html('');
						$compile(iElement.contents())(scope);
					}
				});
			},
			controller : function($scope) {
				$scope.$watch('action', function(action) {
					if (action != undefined) {
						$scope.action = action.getConcreteClassInstance();
					}
				});
			}
		};
	};

	return [ '$compile', ActionEditor ];
});

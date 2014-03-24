(function() {
	'use strict';

	var dependancies = [ 'angular' ];

	define(dependancies, function(angular) {

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
							iElement.html('<' + newType + '-trigger-editor trigger="trigger" triggers="triggers" actions="actions"></' + newType + '-editor>');
							$compile(iElement.contents())(scope);
						} else {
							iElement.html('');
							$compile(iElement.contents())(scope);
						}
					});
				},
			};
		};

		return [ '$compile', TriggerEditor ];
	});
}());

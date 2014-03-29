'use strict';

define([ 'angular' ], function(angular) {

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
						if (newType.toLowerCase() == "group" || newType.toLowerCase() == "sequence") {
							iElement.html('<' + newType + '-editor action="action" actions="actions"></' + newType + '-editor>');
						} else {
							iElement.html('<' + newType + '-editor action="action"></' + newType + '-editor>');
						}
						$compile(iElement.contents())(scope);
					} else {
						iElement.html('');
						$compile(iElement.contents())(scope);
					}
				});
			},
		};
	};

	return [ '$compile', ActionEditor ];
});

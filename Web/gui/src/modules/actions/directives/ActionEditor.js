'use strict';

define(function(require) {
	var angular = require('angular');

	var ActionEditor = function($compile, language) {
		return {
			restrict : 'E',
			scope : {
				action : "=",
				actions : "=",
			},
			link : function(scope, iElement, iAttrs, controller) {
				var childScope;
				var lastSet;
				scope.$watch('action.type', function(newType) {
					if (newType != "" && newType != "Action" && newType != undefined) {
						if (newType != lastSet) {
							lastSet = newType;
							if (childScope) {
								childScope.$destroy();
							}

							childScope = scope.$new();
							iElement.html('<' + newType + '-editor action="action" actions="actions"></' + newType + '-editor>');
							$compile(iElement.contents())(childScope);
						}
					} else {
						iElement.html('');
						if (childScope) {
							childScope.$destroy();
							childScope = null;
						}

						childScope = scope.$new();
						$compile(iElement.contents())(scope);
					}
				});
			},
			controller : function($scope) {
				$scope.language = language.getText();
			}
		};
	};

	return [ '$compile', 'language', ActionEditor ];
});

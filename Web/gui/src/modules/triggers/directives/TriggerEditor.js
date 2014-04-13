'use strict';

define(function(require) {
	var angular = require('angular');

	var TriggerEditor = function($compile, language) {
		return {
			restrict : 'E',
			scope : {
				trigger : "=",
				triggers : "=",
				actions : "=",
			},
			link : function(scope, iElement, iAttrs, controller) {
				var childScope;
				var lastSet;
				scope.$watch('trigger.type', function(newType) {
					if (newType != "" && newType != undefined) {
						if (newType != lastSet) {
							lastSet = newType;
							if (childScope) {
								childScope.$destroy();
							}

							childScope = scope.$new();
							iElement.html('<' + newType + '-editor trigger="trigger" triggers="triggers" actions="actions"></' + newType + '-editor>');
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

	return [ '$compile', 'language', TriggerEditor ];
});

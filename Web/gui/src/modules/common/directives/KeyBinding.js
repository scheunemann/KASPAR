'use strict';

define([ 'angular' ], function(angular) {

	var KeyBinding = function($timeout) {
		return {
			restrict : 'E',
			scope : {
				invoke : '&'
			},
			link : function(scope, element, attrs, controller) {
				if (attr.button) {
					Mousetrap.bind(attr.on, function() {
						scope.invoke();
						var elem = angular.element(el).parent().find(attr.button)
						if (elem) {
							elem.addClass('active');
							$timeout(elem.removeClass('active'), 2000);
						}
					});
				} else {
					Mousetrap.bind(attr.on, scope.invoke);
				}
			},
			controller : function($scope) {
			},
		};
	};

	return [ '$timeout', KeyBinding ];
});

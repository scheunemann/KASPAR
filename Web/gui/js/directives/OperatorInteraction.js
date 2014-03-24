(function() {
	'use strict';

	var dependancies = [ 'angular' ];

	define(dependancies, function(angular) {

		var OperatorInteraction = function() {
			return {
				templateUrl : 'partials/interaction/operator.html',
				restrict : 'E',
				scope : {
					operator : "=",
					user : "=",
					interaction : "=",
					buttons : "=",
					showHotKeys : "=",
					keyBind : "=",
				},
				link : function(scope, element, attrs, controller) {
				},
				controller : function($scope) {
					$scope.isopen = true;

					$scope.setBinding = function(value) {
						// Reversed as this is called BEFORE updating keyBind
						if (!value) {
							Mousetrap.unpause();
						} else {
							Mousetrap.pause();
						}
					};
				},
			};
		};

		return OperatorInteraction;
	});
}());

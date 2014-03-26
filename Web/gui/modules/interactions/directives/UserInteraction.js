(function() {
	'use strict';

	var dependancies = [ 'angular' ];

	define(dependancies, function(angular) {

		var UserInteraction = function() {
			return {
				templateUrl : 'partials/interaction/user.html',
				restrict : 'E',
				scope : {
					user : "=",
					interaction : "=",
					buttons : "=",
					showHotKeys : "=",
					keyBind : "=",
				},
				link : function(scope, element, attrs, controller) {
				},
				controller : function($scope) {
				},
			};
		};

		return UserInteraction;
	});
}());

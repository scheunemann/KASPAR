(function() {
	'use strict';

	var dependancies = [ 'angular' ];

	define(dependancies, function(angular) {

		var NotEmpty = function() {
			return {
				restrict : 'A',
				require : 'ngModel',
				link : function(scope, element, attrs, controller) {
					controller.$parsers.unshift(function(value) {
						if (value == undefined || value == "") {
							ctrl.$setValidity('notEmpty', false);
							return undefined;
						} else {
							ctrl.$setValidity('notEmpty', true);
						}
					});
				}
			}
		};

		return NotEmpty;
	});
}());
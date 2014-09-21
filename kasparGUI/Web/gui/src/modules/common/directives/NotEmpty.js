'use strict';

define(function(require) {
	var angular = require('angular');

	var NotEmpty = function() {
		return {
			restrict : 'A',
			require : 'ngModel',
			link : function(scope, element, attrs, controller) {
				controller.$parsers.unshift(function(value) {
					if (value === undefined || value === "") {
						controller.$setValidity('notEmpty', false);
						return undefined;
					} else {
						controller.$setValidity('notEmpty', true);
					}
				});
			}
		};
	};

	return NotEmpty;
});

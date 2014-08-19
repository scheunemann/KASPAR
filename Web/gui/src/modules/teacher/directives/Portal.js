'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./portal.tpl.html');

	var Portal = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				teacher : '='
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
			}
		};
	};

	return Portal;
});

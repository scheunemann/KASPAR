'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./container_scenario.tpl.html');

	var Container_Scenario = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				scenario : "=",
				selected: "=",
				highlight: "=",
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
			}
		};
	};

	return Container_Scenario;
});

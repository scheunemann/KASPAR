'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./container_objective.tpl.html');

	var Container_Objective = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				objective : '='
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
			}
		};
	};

	return Container_Objective;
});

'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./operatorInteraction.tpl.html')

	var OperatorInteraction = function() {
		return {
			template : template,
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

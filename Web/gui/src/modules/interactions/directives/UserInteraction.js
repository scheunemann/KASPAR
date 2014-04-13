'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./userInteraction.tpl.html');

	var UserInteraction = function(language) {
		return {
			template : template,
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
				$scope.language = language.getText();
			},
		};
	};

	return ['language', UserInteraction];
});

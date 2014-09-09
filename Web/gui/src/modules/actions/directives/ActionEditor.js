'use strict';

define(function(require) {
	var angular = require('angular');
	var _ = require('underscore');
	var template = require('text!./actionEditor.tpl.html');

	var ActionEditor = function($compile, language) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				action : "=",
				actions : "=",
			},
			controller : function($scope) {
				$scope.language = language.getText();
			}
		};
	};

	return [ '$compile', 'language', ActionEditor ];
});

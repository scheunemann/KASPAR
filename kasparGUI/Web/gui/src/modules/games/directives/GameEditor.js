'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./gameEditor.tpl.html');

	var GameEditor = function(language) {
		return {
			template: template,
			restrict : 'E',
			scope : {
				trigger : "=",
				triggers : "=",
				actions : "=",
			},
			controller : function($scope) {
				$scope.language = language.getText();
			}
		};
	};

	return [ 'language', GameEditor ];
});

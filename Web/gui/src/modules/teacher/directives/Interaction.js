'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./interaction.tpl.html');

	var Interaction = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				teacher : '=',
				user : '=',
				selectedGames: '=',
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
			}
		};
	};

	return Interaction;
});

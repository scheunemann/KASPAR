'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./soundEditor.tpl.html');

	var SoundEditor = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				sound : "=action",
			},
			controller : function($scope) {
			},
		};
	}

	return SoundEditor;
});

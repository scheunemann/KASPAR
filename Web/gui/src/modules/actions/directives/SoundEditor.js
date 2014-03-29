'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./soundEditor.tpl.html');
	require('common/services/proxyServices');

	var SoundEditor = function(proxyObjectResolver) {
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

	return [ 'proxyObjectResolver', SoundEditor ];
});

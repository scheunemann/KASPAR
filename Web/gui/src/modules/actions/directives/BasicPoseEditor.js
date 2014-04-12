'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./basicPoseEditor.tpl.html');
	require('actions/models');
	require('common/filters');
	require('robots/directives');

	var BasicPoseEditor = function(JointPosition) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				pose : "=",
				robot : "=",
				connected : "=",
			},
			controller : function($scope) {

			},
		};
	};

	return [ 'JointPosition', BasicPoseEditor ];
});

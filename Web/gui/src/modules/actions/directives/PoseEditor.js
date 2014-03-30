'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./poseEditor.tpl.html');
	require('actions/models');
	require('robots/directives');

	var PoseEditor = function(JointPosition, RobotInterface) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				pose : "=action",
			},
			controller : function($scope) {
			}
		};
	};

	return [ 'JointPosition', 'RobotInterface', PoseEditor ];
});

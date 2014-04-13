'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./poseEditor.tpl.html');
	require('actions/models');
	require('robots/directives');

	var PoseEditor = function(JointPosition, RobotInterface, language) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				pose : "=action",
			},
			controller : function($scope) {
				$scope.language = language.getText();
				$scope.advancedopen = true;
				$scope.basicopen = false;
			}
		};
	};

	return [ 'JointPosition', 'RobotInterface', 'language', PoseEditor ];
});

'use strict';

define(function(require) {
	var angular = require('angular');
	require('robots/models');
	var template = require('text!./robotEditor.tpl.html');

	var RobotEditor = function(RobotModel) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				robot : "=",
			},
			controller : function($scope) {
				$scope.models = RobotModel.query();
				$scope.viewJoints = false;
				$scope.calibrateJoints = false;
			}
		};
	};

	return [ 'RobotModel', RobotEditor ];
});

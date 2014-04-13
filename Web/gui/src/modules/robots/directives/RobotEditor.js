'use strict';

define(function(require) {
	var angular = require('angular');
	require('robots/models');
	var template = require('text!./robotEditor.tpl.html');

	var RobotEditor = function(RobotModel, language) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				robot : "=",
			},
			controller : function($scope) {
				$scope.language = language.getText();
				$scope.models = RobotModel.query();
			}
		};
	};

	return [ 'RobotModel', 'language', RobotEditor ];
});

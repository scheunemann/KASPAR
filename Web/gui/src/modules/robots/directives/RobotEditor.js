'use strict';

define([ 
        'angular', 
        'robots/models/RobotModel',
        'text!./robotEditor.tpl.html',
        ], function(angular, RobotModel, template) {

	var RobotEditor = function(RobotModel) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				robot : "=",
			},
			controller : function($scope) {
				$scope.models = RobotModel.query();

				$scope.viewJoints = function(robot) {
//						$state.transitionTo('robot.view');
				};

				$scope.calibrateJoints = function(robot) {
				};
			}
		};
	};

	return [ 'RobotModel', RobotEditor ];
});

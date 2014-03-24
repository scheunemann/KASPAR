(function() {
	'use strict';

	var dependancies = [ 
	                     'angular', 
	                     'js/models/RobotModel' 
	                     ];

	define(dependancies, function(angular, RobotModel) {

		var RobotEditor = function(RobotModel) {
			return {
				templateUrl : 'partials/robot/edit.html',
				restrict : 'E',
				scope : {
					robot : "=",
				},
				controller : function($scope) {
					$scope.models = RobotModel.query();

					$scope.viewJoints = function(robot) {
						$state.transitionTo('robot.view');
					};

					$scope.calibrateJoints = function(robot) {
						$state.transitionTo('robot.calibrate');
					};
				}
			};
		};

		return [ 'RobotModel', RobotEditor ];
	});
}());

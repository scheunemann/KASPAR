(function() {
	'use strict';

	var dependancies = [ 
	                     'angular',
	                     'text!./poseEditor.tpl.html',
	                     './models/JointPosition',
	                     './directives/AdvancedPoseEditor',
	                     'robots/RobotInterface'
	                     ];

	define(dependancies, function(angular, template, JointPosition, RobotInterface) {

		var PoseEditor = function(JointPosition) {
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
}());

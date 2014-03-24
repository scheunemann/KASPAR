(function() {
	'use strict';

	var dependancies = [ 
	                     'angular', 
	                     'js/models/JointPosition' 
	                     ];

	define(dependancies, function(angular, JointPosition) {

		var PoseEditor = function(JointPosition) {
			return {
				templateUrl : 'partials/action/pose.html',
				restrict : 'E',
				scope : {
					pose : "=action",
				},
				controller : function($scope) {
				}
			};
		};

		return [ 'JointPosition', PoseEditor ];
	});
}());

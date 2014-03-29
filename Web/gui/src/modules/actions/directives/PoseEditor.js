'use strict';

define([ 
        'angular',
        'text!./poseEditor.tpl.html',
        'actions/models',
        'actions/directives',
        'robots/directives'
        ], function(angular, template, actionModels, actionDirectives, robotDirectives) {

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

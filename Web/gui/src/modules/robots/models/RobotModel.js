'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var RobotModel = function($resource) {
		return $resource('/api/robot/model/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', RobotModel ];
});

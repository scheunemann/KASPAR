'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var RobotInterface = function($resource) {
		return $resource('/api/robotinterface/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', RobotInterface ];
});

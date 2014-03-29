'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var ServoConfig = function($resource) {
		return $resource('/api/robot/:robot/servoconfig/:id', {
			robot : '@robot',
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', ServoConfig ];
});

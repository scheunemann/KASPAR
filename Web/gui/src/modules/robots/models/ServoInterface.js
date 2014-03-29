'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var ServoInterface = function($resource) {
		return $resource('/api/servointerface/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', ServoInterface ];
});

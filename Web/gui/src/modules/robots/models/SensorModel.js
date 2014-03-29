'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var SensorModel = function($resource) {
		return $resource('/api/robot/sensor/model/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', SensorModel ];
});

'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var Sensor = function($resource) {
		return $resource('/api/robot/:id/sensor/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', Sensor ];
});

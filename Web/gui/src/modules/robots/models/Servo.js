'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var Servo = function($resource) {
		return $resource('/api/robot/:robot/servo/:id', {
			robot : '@robot',
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', Servo ];
});

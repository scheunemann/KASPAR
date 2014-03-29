'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var ServoModel = function($resource) {
		return $resource('/api/robot/servo/model/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', ServoModel ];
});

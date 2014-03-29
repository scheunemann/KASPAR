'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var JointPosition = function($resource) {
		return $resource('/api/jointposition/:id', {
			id : '@id'
		}, {
			cache : false
		});
	};

	return [ '$resource', JointPosition ];
});

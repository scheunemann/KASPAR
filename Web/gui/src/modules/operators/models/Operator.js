'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var Operator = function($resource) {
		return $resource('/api/operator/:id', {
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', Operator ];
});

'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var ActionTest = function($resource) {
		return $resource('/api/action/:id/test', {
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', ActionTest ];
});

'use strict';

define([ 'angular', 'angularResource' ], function(angular, resource) {

	var Action = function($resource) {
		return $resource('/api/action/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', Action ];
});

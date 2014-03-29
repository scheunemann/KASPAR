'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var Robot = function($resource) {
		return $resource('/api/robot/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', Robot ];
});

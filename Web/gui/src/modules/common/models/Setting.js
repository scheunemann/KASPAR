'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var Setting = function($resource) {
		return $resource('/api/setting/:id', {
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', Setting ];
});

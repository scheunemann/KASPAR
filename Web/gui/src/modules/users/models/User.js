'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var User = function($resource) {
		return $resource('/api/user/:id', {
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', User ];
});

'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var CustomAction = function($resource) {
		return $resource('/api/user/:uid/customaction/:id', {
			uid : '@user_id',
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', CustomAction ];
});

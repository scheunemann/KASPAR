'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var CustomTrigger = function($resource) {
		return $resource('/api/user/:uid/customtrigger/:id', {
			uid : '@user_id',
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', CustomTrigger ];
});

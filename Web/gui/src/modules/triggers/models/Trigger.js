'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var Trigger = function($resource) {
		return $resource('/api/trigger/:id', {
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', Trigger ];
});

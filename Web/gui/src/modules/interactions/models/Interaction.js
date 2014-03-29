'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var Interaction = function($resource) {
		return $resource('/api/interaction/:id', {
			id : '@id'
		}, {
			cache : false
		});
	};

	return [ '$resource', Interaction ];
});

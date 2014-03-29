'use strict';

define([ 'angular', 'angularResource' ], function(angular, resource) {

	var OrderedAction = function($resource) {
		return $resource('/api/orderedaction/:id', {
			id : '@id'
		}, {
			get : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', OrderedAction ];
});

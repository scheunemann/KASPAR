'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

	var TriggerType = function($resource) {
		return $resource('/api/trigger/type/:id', {
			id : '@id'
		}, {
			'get' : {
				method : 'GET',
				cache : true
			}
		});
	};

	return [ '$resource', TriggerType ];
});

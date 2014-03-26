(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular, resource) {

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
}());

(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular, resource) {

		var ActionType = function($resource) {
			return $resource('/api/action/type/:id', {
				id : '@id'
			}, {
				get : {
					method : 'GET',
					cache : true
				}
			});
		};

		return [ '$resource', ActionType ];
	});
}());

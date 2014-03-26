(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular, resource) {

		var Action = function($resource) {
			return $resource('/api/action/:id', {
				id : '@id'
			}, {
				get : {
					method : 'GET',
					cache : true
				}
			});
		};

		return [ '$resource', Action ];
	});
}());

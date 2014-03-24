(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var Robot = function($resource) {
			return $resource('/api/robot/:id', {
				id : '@id'
			}, {
				cache : true
			});
		};

		return [ '$resource', Robot ];
	});
}());

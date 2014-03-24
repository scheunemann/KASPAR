(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var Action = function($resource) {
			return $resource('/api/action/:id', {
				id : '@id'
			}, {
				cache : true
			});
		};

		return [ '$resource', Action ];
	});
}());

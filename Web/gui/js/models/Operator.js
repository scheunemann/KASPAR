(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var Operator = function($resource) {
			return $resource('/api/operator/:id', {
				id : '@id'
			}, {
				cache : true
			});
		};

		return [ '$resource', Operator ];
	});
}());

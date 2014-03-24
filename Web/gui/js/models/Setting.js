(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var Setting = function($resource) {
			return $resource('/api/setting/:id', {
				id : '@id'
			}, {
				cache : true
			});
		};

		return [ '$resource', Setting ];
	});
}());

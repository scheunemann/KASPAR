(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var ActionTest = function($resource) {
			return $resource('/api/action/:id/test', {
				id : '@id'
			}, {
				cache : true
			});
		};

		return [ '$resource', ActionTest ];
	});
}());

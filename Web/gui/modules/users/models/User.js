(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var User = function($resource) {
			return $resource('/api/user/:id', {
				id : '@id'
			}, {
				cache : true
			});
		};

		return [ '$resource', User ];
	});
}());

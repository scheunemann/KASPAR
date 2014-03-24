(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var Interaction = function($resource) {
			return $resource('/api/interaction/:id', {
				id : '@id'
			}, {
				cache : false
			});
		};

		return [ '$resource', Interaction ];
	});
}());

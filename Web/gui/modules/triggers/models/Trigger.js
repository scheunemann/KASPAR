(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var Trigger = function($resource) {
			return $resource('/api/trigger/:id', {
				id : '@id'
			}, {
				cache : true
			});
		};

		return [ '$resource', Trigger ];
	});
}());

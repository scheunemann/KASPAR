(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var OrderedAction = function($resource) {
			return $resource('/api/orderedaction/:id', {
				id : '@id'
			}, {
				cache : true
			});
		};

		return [ '$resource', OrderedAction ];
	});
}());

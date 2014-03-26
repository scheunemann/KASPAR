(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var JointPosition = function($resource) {
			return $resource('/api/jointposition/:id', {
				id : '@id'
			}, {
				cache : false
			});
		};

		return [ '$resource', JointPosition ];
	});
}());

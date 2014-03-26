(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var Servo = function($resource) {
			return $resource('/api/robot/:robot/servo/:id', {
				robot : '@robot',
				id : '@id'
			}, {
				get : {
					method : 'GET',
					cache : true
				}
			});
		};

		return [ '$resource', Servo ];
	});
}());

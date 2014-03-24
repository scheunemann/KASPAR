(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var RobotInterface = function($resource) {
			return $resource('/api/robotinterface/:id', {
				id : '@id'
			}, {
				cache : true
			});
		};

		return [ '$resource', RobotInterface ];
	});
}());

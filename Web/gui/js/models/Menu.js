(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var Menu = function($resource) {
			return $resource('/api/menuOptions', {}, {
				'get' : {
					method : 'GET',
					cache : true
				}
			});
		};

		return [ '$resource', Menu ];
	});
}());

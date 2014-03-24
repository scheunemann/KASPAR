(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var CustomAction = function($resource) {
			return $resource('/api/user/:uid/customaction/:id', {
				uid : '@user_id',
				id : '@id'
			}, {
				cache : true
			});
		};

		return [ '$resource', CustomAction ];
	});
}());

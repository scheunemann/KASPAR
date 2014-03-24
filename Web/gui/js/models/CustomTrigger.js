(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

		var CustomTrigger = function($resource) {
			return $resource('/api/user/:uid/customtrigger/:id', {
				uid : '@user_id',
				id : '@id'
			}, {
				cache : true
			});
		};

		return [ '$resource', CustomTrigger ];
	});
}());

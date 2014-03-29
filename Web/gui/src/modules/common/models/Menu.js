'use strict';

define([ 'angular', 'angularResource' ], function(angular) {

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

'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

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

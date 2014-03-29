'use strict';

define(function(require) {
	angular = require('angular');
	require('angularResource');

	var ButtonHotkey = function($resource) {
		return $resource('/api/trigger/:trigger/hotkey/:id', {
			trigger : '@trigger_id',
			id : '@id'
		}, {
			cache : true
		});
	};

	return [ '$resource', ButtonHotkey ];
});

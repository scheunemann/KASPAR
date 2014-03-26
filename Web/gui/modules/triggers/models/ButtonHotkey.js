(function() {
	'use strict';

	var dependancies = [ 'angular', 'angularResource' ];

	define(dependancies, function(angular) {

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
}());

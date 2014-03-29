	'use strict';

	define( [ 'angular', 'angularResource' ], function(angular) {

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

'use strict';

define(function(require) {
	var Trigger = function($rootScope, modelBuilder) {
		var resource = modelBuilder.getModel('Trigger');

		return resource;
	};

	return [ '$rootScope', 'modelBuilder', Trigger ];
});

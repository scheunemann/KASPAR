'use strict';

define(function(require) {
	var ButtonTrigger = function($rootScope, modelBuilder) {
		var resource = modelBuilder.getModel('ButtonTrigger');

		return resource;
	};

	return [ '$rootScope', 'modelBuilder', ButtonTrigger ];
});

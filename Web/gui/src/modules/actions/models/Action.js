'use strict';

define(function(require) {
	var Action = function(modelBuilder) {
		var resource = modelBuilder.getModel('Action');
		
		return resource;
	};

	return [ 'modelBuilder', Action ];
});

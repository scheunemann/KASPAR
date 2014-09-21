'use strict';

define(function(require) {
	var Robot = function(modelBuilder) {
		var _service = modelBuilder.getModel('Robot');
		
		return _service;
	};

	return [ 'modelBuilder', Robot ];
});

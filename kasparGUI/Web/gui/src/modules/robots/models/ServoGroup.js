'use strict';

define(function(require) {
	var ServoGroup = function(modelBuilder) {
		var _service = modelBuilder.getModel('ServoGroup');
		
		return _service;
	};

	return [ 'modelBuilder', ServoGroup ];
});

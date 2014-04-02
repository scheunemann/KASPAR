'use strict';

define(function(require) {
	var ServoInterface = function(modelBuilder) {
		var _service = modelBuilder.getModel('ServoInterface');
		
		return _service;
	};

	return [ 'modelBuilder', ServoInterface ];
});

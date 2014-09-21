'use strict';

define(function(require) {
	var ServoModel = function(modelBuilder) {
		var _service = modelBuilder.getModel('ServoModel');
		
		return _service;
	};

	return [ 'modelBuilder', ServoModel ];
});

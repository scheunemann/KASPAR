'use strict';

define(function(require) {
	var SensorModel = function(modelBuilder) {
		var _service = modelBuilder.getModel('SensorModel');
		
		return _service;
	};

	return [ 'modelBuilder', SensorModel ];
});

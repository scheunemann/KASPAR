'use strict';

define(function(require) {
	var RobotModel = function(modelBuilder) {
		var _service = modelBuilder.getModel('RobotModel');
		
		return _service;
	};

	return [ 'modelBuilder', RobotModel ];
});

'use strict';

define(function(require) {
	var RobotInterface = function(modelBuilder) {
		var _service = modelBuilder.getModel('RobotInterface');
		
		return _service;
	};

	return [ 'modelBuilder', RobotInterface ];
});

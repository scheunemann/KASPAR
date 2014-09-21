'use strict';

define(function(require) {
	var JointPosition = function(modelBuilder) {
		var _service = modelBuilder.getModel('JointPosition');
		
		return _service;
	};

	return [ 'modelBuilder', JointPosition ];
});

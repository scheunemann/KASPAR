'use strict';

define(function(require) {
	var Servo = function(modelBuilder) {
		var _service = modelBuilder.getModel('Servo');
		
		return _service;
	};

	return [ 'modelBuilder', Servo ];
});

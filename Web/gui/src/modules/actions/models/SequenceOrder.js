'use strict';

define(function(require) {
	var SequenceOrder = function(modelBuilder) {
		var _service = modelBuilder.getModel('SequenceOrder');
		
		return _service;
	};

	return [ 'modelBuilder', SequenceOrder ];
});

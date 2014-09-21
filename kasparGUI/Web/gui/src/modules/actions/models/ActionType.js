'use strict';

define(function(require) {
	var ActionType = function(modelBuilder) {
		var _service = modelBuilder.getModel('ActionType');
		
		return _service;
	};

	return [ 'modelBuilder', ActionType ];
});

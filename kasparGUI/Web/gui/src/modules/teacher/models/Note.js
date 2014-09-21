'use strict';

define(function(require) {
	var Note = function(modelBuilder) {
		var _service = modelBuilder.getModel('Note');
		
		return _service;
	};

	return [ 'modelBuilder', Note ];
});

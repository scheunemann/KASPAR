'use strict';

define(function(require) {
	var ActionTest = function(modelBuilder) {
		var _service = modelBuilder.getModel('ActionTest', {}, {}, 'Action/:id/Test');
		
		return _service;
	};

	return [ 'modelBuilder', ActionTest ];
});

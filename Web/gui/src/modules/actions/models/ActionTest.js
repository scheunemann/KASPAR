'use strict';

define(function(require) {
	var ActionTest = function(modelBuilder) {
		var _service = modelBuilder.getModel('ActionTest');
		
		return _service;
	};

	return [ 'modelBuilder', ActionTest ];
});

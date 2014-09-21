'use strict';

define(function(require) {
	var Setting = function(modelBuilder) {
		var _service = modelBuilder.getModel('Setting');
		
		return _service;
	};

	return [ 'modelBuilder', Setting ];
});

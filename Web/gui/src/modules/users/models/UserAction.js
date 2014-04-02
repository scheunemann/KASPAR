'use strict';

define(function(require) {
	var UserAction = function(modelBuilder) {
		var _service = modelBuilder.getModel('UserAction');
		
		return _service;
	};

	return [ 'modelBuilder', UserAction ];
});

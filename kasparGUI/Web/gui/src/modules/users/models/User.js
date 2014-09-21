'use strict';

define(function(require) {
	var User = function(modelBuilder) {
		var _service = modelBuilder.getModel('User');
		
		return _service;
	};

	return [ 'modelBuilder', User ];
});

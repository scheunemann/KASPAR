'use strict';

define(function(require) {
	var CustomAction = function(modelBuilder) {
		var _service = modelBuilder.getModel('CustomAction');
		
		return _service;
	};

	return [ 'modelBuilder', CustomAction ];
});

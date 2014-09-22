'use strict';

define(function(require) {
	var Objective = function(modelBuilder) {
		var _service = modelBuilder.getModel('Objective');
		
		return _service;
	};

	return [ 'modelBuilder', Objective ];
});

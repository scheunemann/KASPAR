'use strict';

define(function(require) {
	var Interaction = function(modelBuilder) {
		var _service = modelBuilder.getModel('Interaction');
		
		return _service;
	};

	return [ 'modelBuilder', Interaction ];
});

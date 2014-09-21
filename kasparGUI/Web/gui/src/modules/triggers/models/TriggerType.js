'use strict';

define(function(require) {
	var TriggerType = function(modelBuilder) {
		var _service = modelBuilder.getModel('TriggerType');
		
		return _service;
	};

	return [ 'modelBuilder', TriggerType ];
});

'use strict';

define(function(require) {
	var Interaction = function(modelBuilder) {
		var _service = modelBuilder.getModel('InteractionLog', {}, {}, 'Interaction/:interactionId/Log/:id');
		
		return _service;
	};

	return [ 'modelBuilder', Interaction ];
});

'use strict';

define(function(require) {
	var Interaction = function(modelBuilder) {
		var _service = modelBuilder.getModel('Interaction', {}, {
			get : {
				method : 'GET',
				cache : false
			}
		});

		return _service;
	};

	return [ 'modelBuilder', Interaction ];
});

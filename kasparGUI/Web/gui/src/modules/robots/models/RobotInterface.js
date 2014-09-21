'use strict';

define(function(require) {
	var RobotInterface = function(modelBuilder) {
		var _service = modelBuilder.getModel('RobotInterface', {}, {
			get : {
				method : 'GET',
				cache : false
			}
		}, 'Robot/:id/Interface');

		return _service;
	};

	return [ 'modelBuilder', RobotInterface ];
});

'use strict';

define(function(require) {
	var angular = require('angular');

	var ObjectiveService = function() {
		this.getObjectives = function() {
			return [ {
				title : 'Turn Taking',
				key : 'turntaking',
			}, {
				title : 'Interaction',
				key : 'interaction',
			}, {
				title : 'Other',
				key : 'other',
			}, ];
		};
	};

	return ObjectiveService;
});

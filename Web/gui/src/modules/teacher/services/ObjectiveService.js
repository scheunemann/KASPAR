'use strict';

define(function(require) {
	var angular = require('angular');

	var ObjectiveService = function(Objective) {
		this.getObjectives = function() {
			return Objective.query();
		};
	};

	return ['Objective', ObjectiveService];
});

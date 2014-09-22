'use strict';

define(function(require) {
	var angular = require('angular');

	var TagService = function(Tag) {
		this.getObjectives = function() {
			return Tag.query();
		};
	};

	return ['Objective', TagService];
});

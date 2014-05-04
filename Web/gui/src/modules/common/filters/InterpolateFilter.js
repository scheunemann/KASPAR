'use strict';

define(function(require) {
	var InterpolateFilter = function(version) {
		return function(text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		};
	};

	return [ 'version', InterpolateFilter ];
});

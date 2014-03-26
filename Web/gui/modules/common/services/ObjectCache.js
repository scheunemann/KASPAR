(function() {
	'use strict';

	var dependancies = [ 'angular' ];

	define(dependancies, function(angular) {

		var ObjectCache = function($q, $timeout) {
			// $resource does it's own caching, but still builds a new object
			// so need to do our own caching
			var cache = true;
			var objCache = {}; // Don't know if this is a good idea since it'll
			// prevent
			// GC, but we'll see I guess...

			this.getObj = function(key) {
				if (cache && objCache[key] != undefined) {
					return objCache[key].obj;
				} else {
					return null;
				}
			};

			this.setObj = function(key, obj) {
				if (cache) {
					objCache[key] = {
						obj : obj,
						info : {}
					};
				}
			};

			this.hasObj = function(key) {
				if (cache) {
					return objCache.hasOwnProperty(key);
				} else {
					return false;
				}
			};

			this.removeObj = function(key) {
				if (cache) {
					delete objCache[key];
				}
			}
		};

		return [ '$q', '$timeout', ObjectCache ];
	});
}());

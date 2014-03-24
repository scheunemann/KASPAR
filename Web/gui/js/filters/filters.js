(function() {
	'use strict';

	var dependancies = [
	                    'js/filters/ExceptFilter',
	                    'js/filters/InterpolateFilter',
	                    'js/filters/IntersectFilter'
	                    ];	
	
	define(dependancies, function(
			ExceptFilter,
			InterpolateFilter,
			IntersectFilter){

		var moduleName = 'kasparGUI.filters';
		
		var module = angular.module(moduleName, [])
			.filter('except', ExceptFilter)
			.filter('interpolate', InterpolateFilter)
			.filter('intersect', IntersectFilter);
		
		return module;
	});
		
}());

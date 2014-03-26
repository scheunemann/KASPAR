(function() {
	'use strict';

	var dependancies = [
	                     './filters/ExceptFilter',
	                     './filters/InterpolateFilter',
	                     './filters/IntersectFilter'
	                   ];	
	
	define(dependancies, function(
			ExceptFilter,
			InterpolateFilter,
			IntersectFilter){

		var moduleName = 'kasparGUI.common.filters';
		var filterDeps = [];
		
		var module = angular.module(moduleName, filterDeps)
			.filter('except', ExceptFilter)
			.filter('interpolate', InterpolateFilter)
			.filter('intersect', IntersectFilter);
		
		return moduleName;
	});		
}());

(function() {
	'use strict';
	
	var dependancies = [
	                    'angular', 
	                    'angularUIRouter', 
	                    'angularBoostrap', 
	                    'js/models/models', 
	                    'js/filters/filters', 
	                    'js/services/displayServices', 
	                    'js/services/proxyServices', 
	                    'js/directives/directives', 
	                    'js/controllers/controllers',
	                    'js/routes',
	                    'css!../../../css/app.css' 
	                    ];	

	define(dependancies, function(
			angular, 
			angularUIRouter, 
			angularBoostrap, 
			models, 
			filters, 
			displayServices, 
			proxyServices, 
			directives, 
			controllers,
			routes,
			css) {

		var moduleName = 'kasparGUI';		
		var controllerDeps = [
		                      'ui.router',
		                      'kasparGUI.controllers',
		                      'kasparGUI.models'
		                     ];
		
		var kasparGUI = angular.module(moduleName, controllerDeps);
		kasparGUI.config(routes);
    	return kasparGUI;
	});
}());

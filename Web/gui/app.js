(function() {
	'use strict';
	
	var dependancies = [
	                    'angular', 
	                    'angularUIRouter', 
	                    'angularBoostrap',
	                    'text!./default.tpl.html',
	                    'categories/action',
	                    'categories/admin',
	                    'categories/interaction',
	                    'categories/trigger',
	                    'modules/common/controllers',
	                    'modules/common/directives',
	                    'css!app' 
	                    ];

	define(dependancies, function(
			angular, 
			angularUIRouter, 
			angularBoostrap, 
			defaultTemplate,
			action,
			admin,
			interaction,
			trigger,
			commonControllers,
			commonDirectives,
			css) {

		var moduleName = 'kasparGUI';		
		var controllerDeps = [
		                      'ui.router',
		                      'ui.bootstrap',
		                      commonControllers,
		                      commonDirectives,
		                      ];
		
		var Routes = function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise("/");
			$stateProvider.state('default', {
				url : '/',
				template : defaultTemplate,
			});
		};
		
		var module = angular.module(moduleName, controllerDeps);
		module.config([ '$stateProvider', '$urlRouterProvider', Routes ]);
    	return moduleName;
	});
}());
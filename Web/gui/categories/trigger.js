(function() {
	'use strict';
	
	var dependancies = [
	                    'angular', 
	                    'angularUIRouter',
	                    'modules/triggers/controllers',
	                    'text!modules/triggers/index.tpl.html',
	                    'text!modules/triggers/triggerEdit.tpl.html',
	                    'text!modules/triggers/triggerTest.tpl.html',
	                    'text!modules/triggers/triggerImport.tpl.html',
	                    ];

	define(dependancies, function(
			angular, 
			angularUIRouter, 
			triggerControllers,
			defaultTemplate,
			editTemplate,
			testTemplate,
			importTemplate) {

		var moduleName = 'kasparGUI.menu.trigger';		
		var controllerDeps = [ 
		                       'ui.router',
		                       triggerControllers,
		                     ];
		
		var Routes = function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise("/");
			$stateProvider.state('trigger', {
				url : '/',
				template : defaultTemplate,
				controller: 'triggerController',
			}).state('trigger.edit', {
				url : '/:id/edit',
				template: editTemplate,
				controller: 'triggerController',
			}).state('test', {
				url : '/:id/test',
				template : testTemplate,
				controller: 'triggerController',
			}).state('import', {
				url : '/import',
				template : importTemplate,
				controller: 'triggerController',
			});
		};
		
		var module = angular.module(moduleName, controllerDeps);
		module.config([ '$stateProvider', '$urlRouterProvider', Routes ]);
    	return moduleName;
	});
}());

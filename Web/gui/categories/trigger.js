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
				url : '/trigger',
				template : defaultTemplate,
				abstract: true,
			}).state('trigger.edit', {
				url : '{id:(?:/[0-9]{1,8})?}/edit',
				template: editTemplate,
				controller: 'triggerController',
			}).state('trigger.test', {
				url : '{id:(?:/[0-9]{1,8})?}/test',
				template : testTemplate,
				controller: 'triggerController',
			}).state('trigger.import', {
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

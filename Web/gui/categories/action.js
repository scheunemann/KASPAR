(function() {
	'use strict';
	
	var dependancies = [
	                    'angular', 
	                    'angularUIRouter',
	                    'modules/actions/controllers',
	                    'text!modules/actions/index.tpl.html',
	                    'text!modules/actions/actionEdit.tpl.html',
	                    'text!modules/actions/actionImport.tpl.html',
	                    'text!modules/actions/actionTest.tpl.html',
	                    ];

	define(dependancies, function(
			angular, 
			angularUIRouter, 
			actionControllers,
			defaultTemplate,
			editTemplate,
			importTemplate,
			testController,
			testTemplate) {

		var moduleName = 'kasparGUI.menu.action';		
		var controllerDeps = [ 
		                       'ui.router',
		                       actionControllers,
	                         ];
		
		var Routes = function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise("/");
			$stateProvider.state('action', {
				url : '/',
				template : defaultTemplate,
				controller: 'actionController',
			}).state('action.edit', {
				url : '/:id/edit',
				template: editTemplate,
				controller: 'actionController',
			}).state('action.test', {
				url : '/:id/test',
				template : testTemplate,
				controller: 'actionTestController',
			}).state('action.import', {
				url : '/import',
				template : importTemplate,
				controller: 'actionController',
			});
		};
		
		var module = angular.module(moduleName, controllerDeps);
		module.config([ '$stateProvider', '$urlRouterProvider', Routes ]);
    	return moduleName;
	});
}());

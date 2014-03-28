(function() {
	'use strict';
	
	var dependancies = [
	                    'angular', 
	                    'angularUIRouter',
	                    'modules/interactions/controllers',
	                    'text!modules/interactions/index.tpl.html',
	                    'text!modules/interactions/begin.tpl.html',
	                    'text!modules/interactions/log.tpl.html',
	                    'text!modules/interactions/manage.tpl.html',
	                    ];

	define(dependancies, function(
			angular, 
			angularUIRouter, 
			interactionControllers,
			defaultTemplate,
			beginTemplate,
			viewTemplate,
			manageTemplate) {

		var moduleName = 'kasparGUI.menu.interaction';		
		var controllerDeps = [ 
		                       'ui.router',
		                       interactionControllers,
		                     ];
		
		var Routes = function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise("/");
			$stateProvider.state('interaction', {
				url : '/interaction',
				template : defaultTemplate,
				abstract: true,
			}).state('interaction.begin', {
				url : '/begin',
				template: beginTemplate,
				controller: 'interactionController',
			}).state('interaction.view', {
				url : '/view/:id',
				template : viewTemplate,
				controller: 'interactionController',
			}).state('interaction.manage', {
				url : '/manage/:id',
				template : manageTemplate,
				controller: 'interactionController',
			});
		};
		
		var module = angular.module(moduleName, controllerDeps);
		module.config([ '$stateProvider', '$urlRouterProvider', Routes ]);
    	return moduleName;
	});
}());

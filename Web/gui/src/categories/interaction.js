'use strict';

define([
		'angular',
		'angularUIRouter',
		'interactions/controllers',
		'text!interactions/index.tpl.html',
		'text!interactions/begin.tpl.html',
		'text!interactions/log.tpl.html',
		'text!interactions/manage.tpl.html',
], function(angular, angularUIRouter, interactionControllers, defaultTemplate, beginTemplate, viewTemplate, manageTemplate) {

	var moduleName = 'kasparGUI.menu.interaction';
	var dependancies = [ 
	                     'ui.router', 
	                     interactionControllers, 
	                   ];

	var Routes = function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state('interaction', {
			url : '/interaction',
			template : defaultTemplate,
			abstract : true,
		}).state('interaction.begin', {
			url : '/begin',
			template : beginTemplate,
			controller : 'interactionController',
		}).state('interaction.view', {
			url : '{id:(?:/[0-9]{1,8})?}/view',
			template : viewTemplate,
			controller : 'interactionController',
		}).state('interaction.manage', {
			url : '{id:(?:/[0-9]{1,8})?}/manage',
			template : manageTemplate,
			controller : 'interactionController',
		});
	};

	var module = angular.module(moduleName, dependancies);
	module.config([ '$stateProvider', '$urlRouterProvider', Routes ]);
	return moduleName;
});

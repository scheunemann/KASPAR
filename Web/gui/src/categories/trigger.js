'use strict';

define([
		'angular',
		'angularUIRouter',
		'triggers/controllers',
		'text!triggers/index.tpl.html',
		'text!triggers/triggerEdit.tpl.html',
		'text!triggers/triggerTest.tpl.html',
		'text!triggers/triggerImport.tpl.html',
], function(angular, angularUIRouter, triggerControllers, defaultTemplate, editTemplate, testTemplate, importTemplate) {

	var moduleName = 'kasparGUI.menu.trigger';
	var dependancies = [ 
	                     'ui.router', 
	                     triggerControllers, 
	                   ];

	var Routes = function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state('trigger', {
			url : '/trigger',
			template : defaultTemplate,
			abstract : true,
		}).state('trigger.edit', {
			url : '{id:(?:/[0-9]{1,8})?}/edit',
			template : editTemplate,
			controller : 'triggerController',
		}).state('trigger.test', {
			url : '{id:(?:/[0-9]{1,8})?}/test',
			template : testTemplate,
			controller : 'triggerController',
		}).state('trigger.import', {
			url : '/import',
			template : importTemplate,
			controller : 'triggerController',
		});
	};

	var module = angular.module(moduleName, dependancies);
	module.config([ '$stateProvider', '$urlRouterProvider', Routes ]);
	return moduleName;
});

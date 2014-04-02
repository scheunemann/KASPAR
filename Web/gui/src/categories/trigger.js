'use strict';

define(function(require) {
	var angular = require('angular');
	var uiRouter = require('angularUIRouter');
	var triggerControllers = require('triggers/controllers');
	var defaultTemplate = require('text!triggers/index.tpl.html');
	var editTemplate = require('text!triggers/triggerEdit.tpl.html');
	var testTemplate = require('text!triggers/triggerTest.tpl.html');
	var importTemplate = require('text!triggers/triggerImport.tpl.html');

	var moduleName = 'kasparGUI.menu.trigger';
	var dependancies = [ uiRouter, triggerControllers, ];

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

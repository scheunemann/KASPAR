'use strict';

define(function(require) {
	var angular = require('angular');
	var uiRouter = require('angularUIRouter');
	var actionControllers = require('actions/controllers');
	var defaultTemplate = require('text!actions/index.tpl.html');
	var editTemplate = require('text!actions/actionEdit.tpl.html');
	var importTemplate = require('text!actions/actionImport.tpl.html');
	var testTemplate = require('text!actions/actionTest.tpl.html');

	var moduleName = 'kasparGUI.menu.action';
	var dependancies = [ uiRouter, actionControllers ];

	var Routes = function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state('action', {
			url : '/action',
			template : defaultTemplate,
			abstract : true,
		}).state('action.edit', {
			url : '{id:(?:/[0-9]{1,8})?}/edit',
			template : editTemplate,
			controller : 'actionController',
		}).state('action.test', {
			url : '{id:(?:/[0-9]{1,8})?}/test',
			template : testTemplate,
			controller : 'actionTestController',
		}).state('action.import', {
			url : '/import',
			template : importTemplate,
			controller : 'actionController',
		});
	};

	var module = angular.module(moduleName, dependancies);
	module.config([ '$stateProvider', '$urlRouterProvider', Routes ]);
	return moduleName;
});

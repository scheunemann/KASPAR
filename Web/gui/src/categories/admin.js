'use strict';

define(function(require) {
	var angular = require('angular');
	var uiRouter = require('angularUIRouter');
	var operatorControllers = require('operators/controllers');
	var operatorTemplate = require('text!operators/index.tpl.html');
	var userControllers = require('users/controllers');
	var userTemplate = require('text!users/index.tpl.html');
	var robotControllers = require('robots/controllers');
	var robotTemplate = require('text!robots/index.tpl.html');
	var settingsControllers = require('common/controllers');
	var settingsTemplate = require('text!common/settings.tpl.html');

	var moduleName = 'kasparGUI.menu.admin';
	var dependancies = [ uiRouter, operatorControllers, userControllers, robotControllers, settingsControllers, ];

	var Routes = function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state('admin', {
			url : '/admin',
			template : '<ui-view/>',
			abstract : true,
		}).state('admin.operator', {
			url : '/operator{id:(?:/[0-9]{1,8})?}',
			template : operatorTemplate,
			controller : 'operatorController',
		}).state('admin.user', {
			url : '/user{id:(?:/[0-9]{1,8})?}',
			template : userTemplate,
			controller : 'userController',
		}).state('admin.robot', {
			url : '/robot{id:(?:/[0-9]{1,8})?}',
			template : robotTemplate,
			controller : 'robotController',
		}).state('admin.setting', {
			url : '/setting',
			template : settingsTemplate,
			controller : 'settingsController',
		});
	};

	var module = angular.module(moduleName, dependancies);
	module.config([ '$stateProvider', '$urlRouterProvider', Routes ]);
	return moduleName;
});

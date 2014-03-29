'use strict';

define([
		'angular',
		'angularUIRouter',
		'operators/controllers',
		'text!operators/index.tpl.html',
		'users/controllers',
		'text!users/index.tpl.html',
		'robots/controllers',
		'text!robots/index.tpl.html',
		'common/controllers',
		'text!common/settings.tpl.html',
], function(
		angular,
		angularUIRouter,
		operatorControllers,
		operatorTemplate,
		userControllers,
		userTemplate,
		robotControllers,
		robotTemplate,
		settingsControllers,
		settingsTemplate) {

	var moduleName = 'kasparGUI.menu.admin';
	var dependancies = [ 
	                     'ui.router', 
	                     operatorControllers, 
	                     userControllers, 
	                     robotControllers,
	                     settingsControllers, 
	                   ];

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

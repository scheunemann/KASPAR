(function() {
	'use strict';
	
	var dependancies = [
	                    'angular', 
	                    'angularUIRouter',
	                    'modules/operators/controllers',
	                    'text!modules/operators/index.tpl.html',
	                    'modules/users/controllers',
	                    'text!modules/users/index.tpl.html',
	                    'modules/robots/controllers',
	                    'text!modules/robots/index.tpl.html',
	                    'modules/common/controllers',
	                    'text!modules/common/settings.tpl.html',
	                    ];

	define(dependancies, function(
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
		var controllerDeps = [ 
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
				abstract: true,
			}).state('admin.operator', {
				url : '/operator/:id',
				template: operatorTemplate,
				controller: 'operatorController',
			}).state('admin.user', {
				url : '/user/:id',
				template : userTemplate,
				controller: 'userController',
			}).state('admin.robot', {
				url : '/robot/:id',
				template : robotTemplate,
				controller: 'robotController',
			}).state('admin.setting', {
				url : '/setting',
				template : settingsTemplate,
				controller: 'settingsController',
			});
		};
		
		var module = angular.module(moduleName, controllerDeps);
		module.config([ '$stateProvider', '$urlRouterProvider', Routes ]);
    	return moduleName;
	});
}());

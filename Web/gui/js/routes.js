define(['app', 'angularUIRouter'], function(app, angularUIRouter) {
	'use strict';

	return app.config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state('default', {
			url : '/',
			templateUrl : 'partials/default.html',
		}).state('operator', {
			url : '/admin/operator',
			templateUrl : 'partials/operator/operator.html',
		}).state('robot', {
			url : '/admin/robot',
			templateUrl : 'partials/robot/robot.html',
		}).state('user', {
			url : '/admin/user',
			templateUrl : 'partials/user/user.html',
		}).state('settings', {
			url : '/admin/settings',
			templateUrl : 'partials/settings/settings.html',
		}).state('action', {
			url : '/action',
			templateUrl : 'partials/action/action.html',
		}).state('actionTest', {
			url : '/action/test',
			templateUrl : 'partials/action/test.html',
		}).state('actionImport', {
			url : '/action/import',
			templateUrl : 'partials/action/import.html',
		}).state('trigger', {
			url : '/trigger',
			templateUrl : 'partials/trigger/trigger.html',
		}).state('triggerTest', {
			url : '/trigger/test',
			templateUrl : 'partials/trigger/test.html',
		}).state('triggerImport', {
			url : '/trigger/import',
			templateUrl : 'partials/trigger/import.html',
		}).state('interaction', {
			url : '/interaction',
			templateUrl : 'partials/interaction/interaction.html',
		}).state('interactionLog', {
			url : '/interaction/log',
			templateUrl : 'partials/interaction/log.html',
		}).state('interactionManage', {
			url : '/interaction/manage',
			templateUrl : 'partials/interaction/manage.html',
		});
	} ]);
});

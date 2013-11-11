'use strict';

// Declare app level module which depends on filters, and services
angular.module('kasparGUI', ['ui.router', 'ui.bootstrap', 'kasparGUI.filters', 'kasparGUI.directives', 'kasparGUI.controllers'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state(
				'default', {
								url:'/',
								templateUrl: 'static/partials/default.html',
							})
			.state(
				'operator', {
			    				url:'/admin/operator', 
			    				templateUrl: 'static/partials/operator/operator.html', 
	    					})
			.state(
				'robot', {
			    				url:'/admin/robot', 
			    				templateUrl: 'static/partials/robot/robot.html', 
	    					})
    		.state(
				'user', {
			    				url:'/admin/user', 
			    				templateUrl: 'static/partials/user/user.html', 
	    					})
			.state(
				'action', {
			    				url:'/action', 
			    				templateUrl: 'static/partials/action/action.html', 
	    					})
			.state(
				'actionTest', {
			    				url:'/action/test', 
			    				templateUrl: 'static/partials/action/test.html',
	    					})
			.state(
				'actionImport', {
			    				url:'/action/import', 
			    				templateUrl: 'static/partials/action/import.html',
	    					})
			.state(
				'trigger', {
			    				url:'/trigger', 
			    				templateUrl: 'static/partials/trigger/trigger.html', 
	    					})
			.state(
				'triggerTest', {
			    				url:'/trigger/test', 
			    				templateUrl: 'static/partials/trigger/test.html',
	    					})
			.state(
				'triggerImport', {
			    				url:'/trigger/import', 
			    				templateUrl: 'static/partials/trigger/import.html',
	    					})
			.state(
				'interaction', {
			    				url:'/interaction', 
			    				templateUrl: 'static/partials/interaction/interaction.html', 
	    					})
			.state(
				'interactionLog', {
			    				url:'/interaction/log', 
			    				templateUrl: 'static/partials/interaction/log.html', 
	    					})
			.state(
				'interactionManage', {
			    				url:'/interaction/manage', 
			    				templateUrl: 'static/partials/interaction/manage.html', 
	    					})
			;
	}])
;
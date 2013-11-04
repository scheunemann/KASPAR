'use strict';

// Declare app level module which depends on filters, and services
angular.module('kasparGUI', ['ui.router', 'ui.bootstrap', 'kasparGUI.filters', 'kasparGUI.directives', 'kasparGUI.controllers'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider
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
				'robot.calibrate', {
			    				url:'/admin/robot', 
			    				templateUrl: 'static/partials/robot/calibrate.html', 
			    				parent: 'robot',
	    					})
			.state(
				'robot.view', {
			    				url:'/admin/robot', 
			    				templateUrl: 'static/partials/robot/view.html',
			    				parent: 'robot',
	    					})
    		.state(
				'user', {
			    				url:'/admin/user', 
			    				templateUrl: 'static/partials/user/user.html', 
	    					})
			.state(
				'user.customaction', {
			    				url:'/customaction', 
			    				templateUrl: 'static/partials/user/customaction.html', 
		    					parent: 'user'
	    					})
			.state(
				'user.customtrigger', {
			    				url:'/customtrigger', 
			    				templateUrl: 'static/partials/user/customtrigger.html', 
		    					parent: 'user'
	    					})
			.state(
				'action', {
			    				url:'/action', 
			    				templateUrl: 'static/partials/action/action.html', 
	    					})
			.state(
				'action.edit', {
			    				url:'/edit', 
			    				parent: 'action'
	    					})
			.state(
				'actionTest', {
			    				url:'/action/test', 
			    				templateUrl: 'static/partials/action/test.html',
//			    				parent: 'action'
	    					})
			.state(
				'action.import', {
			    				url:'/import', 
			    				templateUrl: 'static/partials/action/import.html',
			    				parent: 'action'
	    					})
			.state(
				'trigger', {
			    				url:'/trigger', 
			    				templateUrl: 'static/partials/trigger/trigger.html', 
	    					})
			.state(
				'trigger.edit', {
			    				url:'/edit', 
			    				templateUrl: 'static/partials/trigger/edit.html',
			    				parent: 'trigger'
	    					})
			.state(
				'trigger.edit.button', {
			    				url:'/button', 
			    				templateUrl: 'static/partials/trigger/button.html',
			    				parent: 'trigger.edit'
	    					})
			.state(
				'trigger.edit.time', {
			    				url:'/time', 
			    				templateUrl: 'static/partials/trigger/time.html',
			    				parent: 'trigger.edit'
	    					})
			.state(
				'trigger.edit.sensor', {
			    				url:'/sensor', 
			    				templateUrl: 'static/partials/trigger/sensor.html',
			    				parent: 'trigger.edit'
	    					})
			.state(
				'trigger.test', {
			    				url:'/test', 
			    				templateUrl: 'static/partials/trigger/test.html',
			    				parent: 'trigger'
	    					})
			.state(
				'trigger.upload', {
			    				url:'/upload', 
			    				templateUrl: 'static/partials/trigger/upload.html',
			    				parent: 'trigger'
	    					})
			.state(
				'interaction', {
			    				url:'/interaction', 
			    				templateUrl: 'static/partials/interaction/interaction.html', 
	    					})
			.state(
				'interaction.log', {
			    				url:'/log', 
			    				templateUrl: 'static/partials/interaction/log.html', 
			    				//parent: 'interaction'
	    					})
			.state(
				'interaction.manage', {
			    				url:'/manage', 
			    				templateUrl: 'static/partials/interaction/manage.html', 
			    				//parent: 'interaction'
	    					})
			;
	}])
;
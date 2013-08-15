'use strict';

// Declare app level module which depends on filters, and services
angular.module('kasparGUI', ['ui.state', 'ui.bootstrap', 'kasparGUI.filters', 'kasparGUI.services', 'kasparGUI.directives', 'kasparGUI.controllers'])
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
			    				templateUrl: 'static/partials/action/edit.html',
			    				parent: 'action'
	    					})
			.state(
				'action.edit.group', {
			    				url:'/group', 
			    				templateUrl: 'static/partials/action/group.html',
			    				parent: 'action.edit'
	    					})
			.state(
				'action.edit.sequence', {
			    				url:'/sequence', 
			    				templateUrl: 'static/partials/action/sequence.html',
			    				parent: 'action.edit'
	    					})
			.state(
				'action.edit.sound', {
			    				url:'/sound', 
			    				templateUrl: 'static/partials/action/sound.html',
			    				parent: 'action.edit'
	    					})
			.state(
				'action.edit.pose', {
			    				url:'/pose', 
			    				templateUrl: 'static/partials/action/pose.html',
			    				parent: 'action.edit'
	    					})
			.state(
				'action.test', {
			    				url:'/test', 
			    				templateUrl: 'static/partials/action/test.html',
			    				parent: 'action'
	    					})
			.state(
				'action.upload', {
			    				url:'/upload', 
			    				templateUrl: 'static/partials/action/upload.html',
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
				'interaction.start', {
			    				url:'/start', 
			    				templateUrl: 'static/partials/interaction/start.html', 
			    				parent: 'interaction'
	    					})
			.state(
				'interaction.log', {
			    				url:'/log', 
			    				templateUrl: 'static/partials/interaction/log.html', 
			    				parent: 'interaction'
	    					})
			.state(
				'interaction.manage', {
			    				url:'/manage', 
			    				templateUrl: 'static/partials/interaction/manage.html', 
			    				parent: 'interaction'
	    					})
			;
	}])
;
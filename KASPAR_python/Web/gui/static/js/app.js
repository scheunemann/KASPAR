'use strict';

// Declare app level module which depends on filters, and services
angular.module('kasparGUI', ['ui.state', 'ui.bootstrap', 'kasparGUI.filters', 'kasparGUI.services', 'kasparGUI.directives', 'kasparGUI.controllers'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state(
				'operator', {
			    				url:'/admin/operator', 
			    				templateUrl: 'static/partials/operator.html', 
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
				'action.group', {
			    				url:'/group', 
			    				templateUrl: 'static/partials/action/group.html',
			    				parent: 'action'
	    					})
			.state(
				'action.sequence', {
			    				url:'/sequence', 
			    				templateUrl: 'static/partials/action/sequence.html',
			    				parent: 'action'
	    					})
			.state(
				'action.sound', {
			    				url:'/sound', 
			    				templateUrl: 'static/partials/action/sound.html',
			    				parent: 'action'
	    					})
			.state(
				'action.pose', {
			    				url:'/pose', 
			    				templateUrl: 'static/partials/action/pose.html',
			    				parent: 'action'
	    					})
			.state(
				'action.test', {
			    				url:'/test', 
			    				templateUrl: 'static/partials/action/test.html',
			    				parent: 'action'
	    					})
    	;
	}])
;
'use strict';

define(function(require) {
	var angular = require('angular');
	var angularRouter = require('angularUIRouter');
	var angularBootstrap = require('angularBoostrap');
	var modelServices = require('common/services/modelServices');

	var defaultTemplate = require('text!./default.tpl.html');
	var action = require('categories/action');
	var admin = require('categories/admin');
	var interaction = require('categories/interaction');
	var trigger = require('categories/trigger');
	var commonControllers = require('common/controllers');
	var commonDirectives = require('common/directives');
	var actionDirectives = require('actions/directives');
	
	var moduleName = 'kasparGUI';
	var dependancies = [ 
	                     angularRouter, 
	                     angularBootstrap, 
	                     commonControllers, 
	                     commonDirectives, 
	                     action, 
	                     admin, 
	                     interaction, 
	                     trigger 
	                   ];
	
	var Routes = function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise("/");
		$stateProvider.state('default', {
			url : '/',
			template : defaultTemplate,
		});
	};
	
	var ApiConfig = function(modelBuilderProvider) {
		modelBuilderProvider.setBasePath('/api');
	}

	var module = angular.module(moduleName, dependancies);
	module.config([ '$stateProvider', '$urlRouterProvider', '$locationProvider', Routes ]);
	module.config([ 'modelBuilderProvider', ApiConfig ]);
	return moduleName;
});

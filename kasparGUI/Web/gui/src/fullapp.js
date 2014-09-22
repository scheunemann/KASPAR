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
    var game = require('categories/game');
	var teacher = require('categories/teacher');
	var commonControllers = require('common/controllers');
	var commonDirectives = require('common/directives');
	var robotsDirectives = require('robots/directives');
	var actionDirectives = require('actions/directives');

	var moduleName = 'kasparGUI';
	var dependancies = [
						angularRouter,
						angularBootstrap,
						commonControllers,
						commonDirectives,
						robotsDirectives,
						action,
						admin,
						interaction,
						trigger,
						game,
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
	};

	var module = angular.module(moduleName, dependancies);
	module.config([ '$stateProvider', '$urlRouterProvider', '$locationProvider', Routes ]);
	module.config([ 'modelBuilderProvider', ApiConfig ]);
	return moduleName;
});

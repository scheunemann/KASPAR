'use strict';

define(function(require) {
	var angular = require('angular');
	var uiRouter = require('angularUIRouter');
	var interactionControllers = require('interactions/controllers');
	var defaultTemplate = require('text!interactions/index.tpl.html');
	var beginTemplate = require('text!interactions/begin.tpl.html');
	var viewTemplate = require('text!interactions/log.tpl.html');
	var manageTemplate = require('text!interactions/manage.tpl.html');

	var moduleName = 'kasparGUI.menu.interaction';
	var dependancies = [ uiRouter, interactionControllers, ];

	var Routes = function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state('interaction', {
			url : '/interaction',
			template : defaultTemplate,
			abstract : true,
		}).state('interaction.begin', {
			url : '/begin',
			template : beginTemplate,
			controller : 'interactionController',
		}).state('interaction.view', {
			url : '{id:(?:/[0-9]{1,8})?}/view',
			template : viewTemplate,
			controller : 'interactionController',
		}).state('interaction.manage', {
			url : '{id:(?:/[0-9]{1,8})?}/manage',
			template : manageTemplate,
			controller : 'interactionController',
		});
	};

	var module = angular.module(moduleName, dependancies);
	module.config([ '$stateProvider', '$urlRouterProvider', Routes ]);
	return moduleName;
});

'use strict';

define(function(require) {
	var angular = require('angular');
	var uiRouter = require('angularUIRouter');
	var gameControllers = require('games/controllers');
	var defaultTemplate = require('text!games/index.tpl.html');
	var editTemplate = require('text!games/gameEdit.tpl.html');
	var importTemplate = require('text!games/gameImport.tpl.html');

	var moduleName = 'kasparGUI.menu.game';
	var dependancies = [ uiRouter, gameControllers, ];

	var Routes = function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state('game', {
			url : '/game',
			template : defaultTemplate,
			abstract : true,
		}).state('game.edit', {
			url : '{id:(?:/[0-9]{1,8})?}/edit',
			template : editTemplate,
			controller : 'gameController',
		}).state('game.import', {
			url : '/import',
			template : importTemplate,
			controller : 'gameController',
		});
	};

	var module = angular.module(moduleName, dependancies);
	module.config([ '$stateProvider', '$urlRouterProvider', Routes ]);
	return moduleName;
});

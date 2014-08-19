'use strict';

define(function(require) {
	var angular = require('angular');
	var uiRouter = require('angularUIRouter');
	var defaultTemplate = require('text!teacher/index.tpl.html');
	var teacherMain = require('teacher/main');

	var moduleName = 'kasparGUI.menu.teacher';
	var dependancies = [ uiRouter, teacherMain ];

	var Routes = function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state('home', {
			url : '/',
			template : defaultTemplate,
		});
	};

	var module = angular.module(moduleName, dependancies);
	module.config([ '$stateProvider', '$urlRouterProvider', Routes ]);
	return moduleName;
});

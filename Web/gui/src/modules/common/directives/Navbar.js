'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularUIRouter');
	var commonModels = require('common/models');
	var template = require('text!./navbar.tpl.html');

	var Navbar = function(Menu) {
		return {
			template : template,
			restrict : 'E',
			scope : {},
			controller : function($scope) {
				$scope.groups = Menu.query();
			},
		};
	};

	return [ 'Menu', Navbar ];
});
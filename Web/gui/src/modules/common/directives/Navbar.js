'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularUIRouter');
	var commonModels = require('common/models');
	var template = require('text!./navbar.tpl.html');

	var Navbar = function($state, Menu) {
		return {
			template : template,
			restrict : 'E',
			scope : {},
			controller : function($scope) {
				Menu.get(function(m) {
					$scope.title = m.title;
					$scope.groups = m.groups;
				});
				$scope.state = $state;
			},
		};
	};

	return [ '$state', 'Menu', Navbar ];
});

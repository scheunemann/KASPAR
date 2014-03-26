(function() {
	'use strict';
	
	var dependancies = [ 
	                     'angular', 
	                     'angularUIRouter',
	                     'modules/common/models',
	                     'text!./navbar.tpl.html',
	                     ];
	
	define(dependancies, function(
			angular, 
			uiRouter, 
			commonModels, 
			template) {

		var Navbar = function($state, Menu) {
			return {
				template : template,
				restrict : 'E',
				scope : {
				},
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
}());

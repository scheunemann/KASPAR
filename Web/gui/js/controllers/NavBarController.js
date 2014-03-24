(function() {
	'use strict';
	
	var dependancies = [ 
	                     'angular', 
	                     'angularUIRouter',
	                     'js/models/models'
	                     ];
	
	define(dependancies, function(angular, uiRouter, models) {

		var NavBarController = function($scope, $state, Menu) {
			Menu.get(function(m) {
				$scope.title = m.title;
				$scope.groups = m.groups;
			});
			$scope.state = $state;
		};

		return [ '$scope', '$state', 'Menu', NavBarController ];

	});
}());

(function() {
	'use strict';

	var dependancies = [ 'angular' ];

	define(dependancies, function(angular) {

		var CommonController = function($scope) {
			$scope.version = '3.0 Alpha 7';
		}

		return [ '$scope', CommonController ];
	});
}());

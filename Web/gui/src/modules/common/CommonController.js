'use strict';

define(function(require) {
	var angular = require('angular');

	var CommonController = function($scope, $rootScope) {
		$scope.version = '3.0 Alpha 7';

//		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
//			console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
//		});
//		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams) {
//			console.log('$stateChangeError - fired when an error occurs during transition.');
//			console.log(arguments);
//		});
//		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
//			console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
//		});
//		$rootScope.$on('$viewContentLoaded', function(event) {
//			console.log('$viewContentLoaded - fired after dom rendered', event);
//		});
//		$rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
//			console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
//			console.log(unfoundState, fromState, fromParams);
//		});
	}

	return [ '$scope', '$rootScope', CommonController ];
});

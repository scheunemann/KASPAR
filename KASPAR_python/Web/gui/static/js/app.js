'use strict';

// Declare app level module which depends on filters, and services
angular.module('kasparGUI', ['ui.bootstrap', 'kasparGUI.filters', 'kasparGUI.services', 'kasparGUI.directives', 'kasparGUI.controllers'])
	.config(['$routeProvider', function($routeProvider) {
	    $routeProvider
	    	.when('/admin/operator', {templateUrl: 'static/partials/operator.html', controller: 'commonController'})
	    	//.otherwise({redirectTo: '/view2'})
	    	;
	}]);
'use strict';

// Declare app level module which depends on filters, and services
angular.module('kasparGUI', ['ui.bootstrap', 'kasparGUI.filters', 'kasparGUI.services', 'kasparGUI.directives', 'kasparGUI.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    	when('/view1', {templateUrl: 'static/partials/partial1.html', controller: 'commonController'}).
    	when('/view2', {templateUrl: 'static/partials/partial2.html', controller: 'commonController'}).
    	otherwise({redirectTo: '/view2'});
  }]);
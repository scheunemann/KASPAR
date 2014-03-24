define([ 
         'angular', 
         'angularUIRouter', 
         'angularBoostrap', 
         'models', 
         'filters', 
         'displayServices', 
         'proxyServices', 
         'directives', 
         'controllers', 
         'css!../css/app.css' 
         ], function(
		angular, angularUIRouter, angularBoostrap, models, filters, displayServices, proxyServices, directives, controllers, css) {
	'use strict';
	return angular.module('kasparGUI', [ 
	                                     'ui.router', 
	                                     'ui.bootstrap', 
	                                     'kasparGUI.controllers', 
	                                     'kasparGUI.filters', 
	                                     'kasparGUI.displayServices',
	                                     'kasparGUI.proxyServices', 
	                                     'kasparGUI.directives', 
	                                     'kasparGUI.models' ]);

});

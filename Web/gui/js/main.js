require.config({
	baseUrl : "/",
	paths : {
		angular : 'bower_components/angular/angular.min',
		angularSlider : 'bower_components/angular-slider/angular-slider.min',
		angularUIRouter : 'bower_components/angular-ui-router/release/angular-ui-router.min',
		angularResource : 'bower_components/angular-resource/angular-resource.min',
		angularRoute : 'bower_components/angular-route/angular-route.min',
		angularToggleSwitch : 'bower_components/angular-toggle-switch/angular-toggle-switch.min',
		angularBoostrap : 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
		mousetrap : 'bower_components/mousetrap/mousetrap.min',
		mousetrapPause : 'bower_components/mousetrap/plugins/pause/mousetrap-pause.min',
		text : 'bower_components/requirejs-text/text',
		app : 'js/app',
		models : 'js/models',
		displayServices : 'js/displayServices',
		proxyServices : 'js/proxyServices',
		controllers : 'js/controllers',
		filters : 'js/filters',
		routes : 'js/routes',
		directives : 'js/directives',
	},
	shim : {
		'angular' : {
			'exports' : 'angular'
		},
		'angularSlider' : [ 'angular' ],
		'angularUIRouter' : [ 'angular' ],
		'angularResource' : [ 'angular' ],
		'angularRouter' : [ 'angular' ],
		'mouseTrap' : {
			'exports' : 'mouseTrap'
		},
		'mouseTrapPause' : [ 'mouseTrap' ],
		'angularBoostrap' : {
			exports : 'angularBoostrap',
			deps : [ 'text', 'css!lib/bootstrap/dist/css/bootstrap.min.css', 'css!lib/bootstrap/dist/css/bootstrap-theme.min.css' ]
		},
	},
	map : {
		'*' : {
			'css' : 'bower_components/require-css/css'
		}
	},
	priority : [ "angular" ]
});

// http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require([ 'angular', 'app' ], function(angular, app) {
	'use strict';
	var $html = angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		angular.resumeBootstrap([ app['name'] ]);
	});
});

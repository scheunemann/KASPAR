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
	},
	shim : {
		'angular' : {
			'exports' : 'angular'
		},
		'angularSlider' : [ 'angular', 'css!bower_components/angular-slider/angular-slider.min.css' ],
		'angularToggleSwitch' : [ 'angular', 'css!bower_components/angular-toggle-switch/angular-toggle-switch.css',
				'css!bower_components/angular-toggle-switch/angular-toggle-switch-bootstrap.css' ],
		'angularUIRouter' : [ 'angular' ],
		'angularResource' : [ 'angular' ],
		'angularRouter' : [ 'angular' ],
		'mousetrap' : {
			exports : 'mousetrap'
		},
		'mousetrapPause' : [ 'mousetrap' ],
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

require([ 'angular', 'js/app' ], function(angular, app) {
	'use strict';
	
	angular.element(document).ready(function() {
		angular.bootstrap(document, [app['name'], ]);
	});
});

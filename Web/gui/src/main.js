require.config({
	baseUrl : "/",
	paths : {
		angular : 'bower_components/angular/angular.min',
		angularBoostrap : 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
		angularResource : 'bower_components/angular-resource/angular-resource.min',
		angularRoute : 'bower_components/angular-route/angular-route.min',
		angularUIRouter : 'bower_components/angular-ui-router/release/angular-ui-router.min',
		mousetrap : 'bower_components/mousetrap/mousetrap.min',
		mousetrapPause : 'bower_components/mousetrap/plugins/pause/mousetrap-pause.min',
		text : 'bower_components/requirejs-text/text',
		categories : 'categories',
	},
	shim : {
		'angular' : {
			exports : 'angular'
		},
		'angularBoostrap' : {
			init : function() {
				return 'ui.bootstrap';
			},
			deps : [ 'text', 'angular' ],
		},
		'angularResource' : {
			init : function() {
				return 'ngResource';
			},
			deps : [ 'angular', ],
		},
		'angularRouter' : {
			init : function() {
				return 'angularRouter';
			},
			deps : [ 'angular' ],
		},
		'angularUIRouter' : {
			init : function() {
				return 'ui.router';
			},
			deps : [ 'angular' ]
		},
		'mousetrap' : {
			exports : 'mousetrap'
		},
		'mousetrapPause' : [ 'mousetrap' ],
	},
	packages : [ {
		name : 'actions',
		location : 'modules/actions',
	}, {
		name : 'common',
		location : 'modules/common',
	}, {
		name : 'interactions',
		location : 'modules/interactions',
	}, {
		name : 'operators',
		location : 'modules/operators',
	}, {
		name : 'robots',
		location : 'modules/robots',
	}, {
		name : 'triggers',
		location : 'modules/triggers',
	}, {
		name : 'users',
		location : 'modules/users'
	} ],
	priority : [ "angular" ]
});

require([ 'angular', 'app' ], function(angular, app) {
	'use strict';

	angular.element(document).ready(function() {
		angular.bootstrap(document, [ app, ]);
	});
});

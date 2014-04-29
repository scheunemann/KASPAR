require.config({
	baseUrl : "/",
	paths : {
		angular : 'bower_components/angular/angular',
		jquery : 'bower_components/jquery/jquery',
		jqueryUI : 'bower_components/jquery-ui/ui/jquery-ui',
		angularSlider : 'bower_components/angular-ui-slider/src/slider',
		angularBoostrap : 'bower_components/angular-bootstrap/ui-bootstrap-tpls',
		angularResource : 'bower_components/angular-resource/angular-resource',
		angularUIRouter : 'bower_components/angular-ui-router/release/angular-ui-router',
		mousetrap : 'bower_components/mousetrap/mousetrap',
		mousetrapPause : 'bower_components/mousetrap/plugins/pause/mousetrap-pause',
		text : 'bower_components/requirejs-text/text',
		categories : 'categories',
	},
	shim : {
		'angular' : {
			exports : 'angular',
			deps : [ 'jquery', ]
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
		'angularUIRouter' : {
			init : function() {
				return 'ui.router';
			},
			deps : [ 'angular' ]
		},
		'angularSlider' : {
			init : function() {
				return 'ui.slider';
			},
			deps : [ 'angular', 'jquery', 'jqueryUI' ]
		},
		'jqueryUI' : {
			deps : [ 'jquery', ]
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
	

	angular.element(document).ready(function() {
		angular.bootstrap(document, [ app, ]);
	});
});

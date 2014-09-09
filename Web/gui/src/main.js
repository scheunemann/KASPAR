require.config({
	baseUrl : "/",
	paths : {
		underscore : 'bower_components/underscore/underscore-min',
		angular : 'bower_components/angular/angular.min',
		jquery : 'bower_components/jquery/jquery.min',
		jqueryUI : 'bower_components/jquery-ui/ui/minified/jquery-ui.min',
		angularSlider : 'bower_components/angular-ui-slider/src/slider',
		angularXEditable : 'bower_components/angular-xeditable/dist/js/xeditable.min',
		angularBoostrap : 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
		angularResource : 'bower_components/angular-resource/angular-resource.min',
		angularUIRouter : 'bower_components/angular-ui-router/release/angular-ui-router.min',
		mousetrap : 'bower_components/mousetrap/mousetrap.min',
		mousetrapPause : 'bower_components/mousetrap/plugins/pause/mousetrap-pause.min',
		text : 'bower_components/requirejs-text/text',
		socketio : 'bower_components/socket.io-client/dist/socket.io.min',
		categories : 'categories',
	},
	shim : {
		'underscore' : {
			exports : '_'
		},
		'angular' : {
			exports : 'angular',
			deps : [ 'jquery', ]
		},
		'angularBoostrap' : {
			init : function() {
				'use strict';
				return 'ui.bootstrap';
			},
			deps : [ 'text', 'angular' ],
		},
		'angularResource' : {
			init : function() {
				'use strict';
				return 'ngResource';
			},
			deps : [ 'angular', ],
		},
		'angularUIRouter' : {
			init : function() {
				'use strict';
				return 'ui.router';
			},
			deps : [ 'angular' ]
		},
		'angularXEditable' : {
			init : function() {
				'use strict';
				return 'xeditable';
			},
			deps : [ 'angular' ]
		},
		'angularSlider' : {
			init : function() {
				'use strict';
				return 'ui.slider';
			},
			deps : [ 'angular', 'jquery', 'jqueryUI' ]
		},
		'jqueryUI' : {
			deps : [ 'jquery', ]
		},
		'mousetrap' : {
			exports : 'Mousetrap'
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
	}, {
		name : 'teacher',
		location : 'modules/teacher',
	} ],
	priority : [ "angular" ]
});

require([ 'angular', 'fullapp' ], function(angular, app) {
	'use strict';

	angular.element(document).ready(function() {
		angular.bootstrap(document, [ app, ]);
	});
});

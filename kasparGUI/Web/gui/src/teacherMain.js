require.config({
        baseUrl: "/",
        paths: {
            underscore: 'bower_components/underscore/underscore-min',
            angular: 'bower_components/angular/angular',
            jquery: 'bower_components/jquery/jquery.min',
            angularBoostrap: 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
            angularResource: 'bower_components/angular-resource/angular-resource.min',
            angularUIRouter: 'bower_components/angular-ui-router/release/angular-ui-router.min',
            text: 'bower_components/requirejs-text/text',
            socketio: 'bower_components/socket.io-client/dist/socket.io.min',
            categories: 'categories',
        },
        shim: {
            'underscore': {
                exports: '_'
            },
            'angular': {
                exports: 'angular',
                deps: ['jquery', ]
            },
            'angularBoostrap': {
                init: function() {
                    'use strict';
                    return 'ui.bootstrap';
                },
                deps: ['text', 'angular'],
            },
            'angularResource': {
                init: function() {
                    'use strict';
                    return 'ngResource';
                },
                deps: ['angular', ],
            },
            'angularUIRouter': {
                init: function() {
                    'use strict';
                    return 'ui.router';
                },
                deps: ['angular']
            },
        },
        packages: [{
                name: 'actions',
                location: 'modules/actions',
            }, {
                name: 'common',
                location: 'modules/common',
            }, {
                name: 'operators',
                location: 'modules/operators',
            }, {
                name: 'robots',
                location: 'modules/robots',
            }, {
                name: 'triggers',
                location: 'modules/triggers',
            }, {
                name: 'users',
                location: 'modules/users'
            }, {
                name: 'teacher',
                location: 'modules/teacher',
            }
        ],
        priority: ["angular"]
    });

require(['angular', 'simpleapp'], function(angular, app) {
        'use strict';

        angular.element(document).ready(function() {
                angular.bootstrap(document, [app, ]);
            });
    });
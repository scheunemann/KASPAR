'use strict';

define(function(require) {
        var angular = require('angular');
        var controllers = require('./controllers');
        var directives = require('./directives');
        var models = require('./models');

        var moduleName = 'kasparGUI.robots';
        var dependancies = [
            controllers,
            directives,
            models,
        ];

        var module = angular.module(moduleName, dependancies);
        return moduleName;
    });

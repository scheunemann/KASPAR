'use strict';

define(function(require) {
        var angular = require('angular');
        //	var controllers = require('./controllers');
        var directives = require('./directives');
        //	var filters = require('./filters');
        //	var models = require('./models');

        var moduleName = 'kasparGUI.teacher';
        var dependancies = [
            //						controllers,
            directives,
            //						models,
            //						filters
        ];

        var module = angular.module(moduleName, dependancies);
        return moduleName;
    });

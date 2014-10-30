'use strict';

define(function(require) {
        var angular = require('angular');
        var models = require('operators/models');
        var LoginService = require('./LoginService');

        var moduleName = 'kasparGUI.teacher.authenticationService';
        var dependancies = [
            models,
        ];

        var module = angular.module(moduleName, dependancies)
            .service('loginService', LoginService);

        return moduleName;
    });

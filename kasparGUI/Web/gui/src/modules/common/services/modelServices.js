'use strict';

define(function(require) {
        var angular = require('angular');
        var angularResource = require('angularResource');
        var ModelBuilder = require('./ModelBuilder');

        var moduleName = 'kasparGUI.common.modelServices';
        var dependancies = [angularResource];

        var module = angular.module(moduleName, dependancies)
            .provider('modelBuilder', ModelBuilder);

        return moduleName;
    });

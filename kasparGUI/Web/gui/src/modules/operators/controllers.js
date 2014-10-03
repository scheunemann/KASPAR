'use strict';

define(function(require) {
        var angular = require('angular');
        var languageServices = require('common/i18n/languageServices');
        var userModels = require('users/models');
        var operatorModels = require('operators/models');
        var OperatorController = require('./OperatorController');

        var moduleName = 'kasparGUI.operators.controllers';
        var dependancies = [
            userModels,
            languageServices,
            operatorModels,
        ];

        var module = angular.module(moduleName, dependancies)
            .controller('operatorController', OperatorController);

        return moduleName;
    });

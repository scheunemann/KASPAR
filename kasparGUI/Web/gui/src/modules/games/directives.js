'use strict';

define(function(require) {
        var angular = require('angular');
        var languageServices = require('common/i18n/languageServices');
        var displayServices = require('common/services/displayServices');
        var filters = require('common/filters');
        var triggerModels = require('triggers/models');
        var GameEditor = require('./directives/GameEditor');

        var moduleName = 'kasparGUI.games.directives';
        var dependancies = [
            displayServices,
            languageServices,
            filters,
            triggerModels,
        ];

        var module = angular.module(moduleName, dependancies)
            .directive('gameEditor', GameEditor);

        return moduleName;
    });

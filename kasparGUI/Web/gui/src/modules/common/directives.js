'use strict';

define(function(require) {
        var angular = require('angular');
        var languageServices = require('common/i18n/languageServices');
        var displayServices = require('common/services/displayServices');
        var filters = require('common/filters');
        var KeyBinding = require('./directives/KeyBinding');
        var Model = require('./directives/Model');
        var Navbar = require('./directives/Navbar');
        var NotEmpty = require('./directives/NotEmpty');
        var FileModel = require('./directives/FileModel');
        var Saveable = require('./directives/Saveable');
        var Slider = require('./directives/Slider');
        var Dropdown = require('./directives/Dropdown');

        var moduleName = 'kasparGUI.common.directives';
        var dependancies = [
            displayServices,
            languageServices,
            filters,
        ];

        var module = angular.module(moduleName, dependancies)
            .directive('keybinding', KeyBinding)
            .directive('model', Model)
            .directive('guislider', Slider)
            .directive('navbar', Navbar)
            .directive('notEmpty', NotEmpty)
            .directive('fileModel', FileModel)
            .directive('saveable', Saveable)
            .directive('dropdown', Dropdown);

        return moduleName;
    });

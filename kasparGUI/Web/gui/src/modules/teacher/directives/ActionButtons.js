'use strict';

define(function(require) {
        var angular = require('angular');
        require('common/services/displayServices');
        require('actions/models');
        var template = require('text!./actionButtons.tpl.html');

        var ActionButtons = function($q, hotkeyFormatter, language) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    buttons: "=",
                    interaction: "=",
                    showHotKeys: "=",
                    keyBind: "=",
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.language = language.getText();
                },
            };
        };

        return ['$q', 'hotkeyFormatter', 'language', ActionButtons];
    });
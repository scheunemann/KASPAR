'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./triggerEditor.tpl.html');

        var TriggerEditor = function($compile, language) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    trigger: "=",
                    triggers: "=",
                    actions: "=",
                },
                controller: function($scope) {
                    $scope.language = language.getText();
                }
            };
        };

        return ['$compile', 'language', TriggerEditor];
    });

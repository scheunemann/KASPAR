'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./container_note.tpl.html');

        var Container_Note = function() {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    note: "=",
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {}
            };
        };

        return Container_Note;
    });

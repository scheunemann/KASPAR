'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./container_user.tpl.html');

        var Container_User = function() {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    user: "=",
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {}
            };
        };

        return Container_User;
    });

'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./container_game.tpl.html');

        var Container_Game = function() {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    game: "=",
                    userFilter: "=?",
                    short: "=?",
                    playCounter: "=?",
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                }
            };
        };

        return Container_Game;
    });

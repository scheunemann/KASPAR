'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./home.tpl.html');

        var Home = function(gameService, loginService) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    teacher: '=',
                    user: '='
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.selectedGames = gameService.getGames();

                    $scope.signOut = function() {
                        loginService.logout();
                    };
                }
            };
        };

        return ['gameService', 'loginService', Home];
    });

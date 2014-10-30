'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./login.tpl.html');

        var Login = function(loginService) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    teacher: '=',
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.username = 'Teacher';

                    $scope.login = function() {
                        loginService.login($scope.username, $scope.password);
                    };
                }
            };
        };

        return ['loginService', Login];
    });

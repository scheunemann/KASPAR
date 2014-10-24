'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./users.tpl.html');

        var Users = function(userService) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    user: '=',
                    teacher: '=',
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.newUser = {
                        name: 'New User',
                        birthday: '',
                        gender: '',
                        thumbsrc: 'new_thumb.png',
                        fullsrc: 'new.png',
                    };

                    $scope.users = userService.getUsers();

                    $scope.selectUser = function(user) {
                        $scope.user = user;
                    };

                    $scope.addUser = function() {
                        userService.addUser(null, $scope.users);
                    };
                }
            };
        };

        return ['userService', Users];
    });

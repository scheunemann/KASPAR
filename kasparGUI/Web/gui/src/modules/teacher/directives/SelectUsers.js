'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./selectUsers.tpl.html');

        var SelectUsers = function(userService) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    selectedUsers: '=',
                    teacher: '=',
                    multiple: '=?',
                    onFinished: '&?',
                    onCanceled: '&?',
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                     $scope.newUser = {
                         name: 'New User'
                     };

                     $scope.users = userService.getUsers();
                     if ($scope.multiple === undefined) {
                         $scope.multiple = true;
                     }

                     $scope.$watch('selectedUsers', function(users) {
                        if (users !== $scope.selected) {
                            $scope.selected = users;
                        }
                     });

                     $scope.back = function() {
                         if ($scope.onCanceled) {
                             $scope.onCanceled();
                         }
                     };

                     $scope.next = function() {
                         $scope.selectedUsers = $scope.selected;
                         if ($scope.onFinished) {
                             $scope.onFinished();
                         }
                     };

                     $scope.selectUser = function(user) {
                         if (!$scope.selected) {
                             $scope.selected = [];
                         }

                         if ($scope.multiple) {
                             for (var i = 0; i < $scope.selected.length; i++) {
                                 if ($scope.selected[i] == user) {
                                     $scope.selected.splice(i, 1);
                                     return;
                                 }
                             }

                             $scope.selected.push(user);
                         } else {
                             $scope.selected = [user];
                         }
                     };

                     $scope.isSelected = function(user) {
                         if ($scope.selected) {
                             for (var i = 0; i < $scope.selected.length; i++) {
                                 if ($scope.selected[i] == user) {
                                     return true;
                                 }
                             }
                         }

                         return false;
                     };

                     $scope.addUser = function() {
                         userService.addUser(null, $scope.users);
                     };
                }
            };
        };

        return ['userService', SelectUsers];
    });

'use strict';

define(function(require) {
        var angular = require('angular');
        var _ = require('underscore');
        require('teacher/services/dataProvider');
        var template = require('text!./history.tpl.html');

        var History = function(userService, interactionService) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    teacher: '=',
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.users = userService.getUsers();
                    $scope.interactions = interactionService.getInteractions();

                    $scope.colors = ['bad', 'moderate_bad', 'neutral', 'moderate_good', 'good'];

                    $scope.select = function(interaction) {
                        $scope.selectedInteraction = interaction;
                    };

                    $scope.userFilter = function(element) {
                        if (!$scope.selectedUser) {
                            return true;
                        } else {
                            return element && element.user && element.user.id == $scope.selectedUser.id;
                        }
                    };

                    $scope.getAverageScore = function(users) {
                        if (users) {
                            var total = 0;
                            _.each(users, function(user) {
                                    total += user.engagement + user.experience;
                                });
                            return Math.round((total / users.length / 2) - 1);
                        } else {
                            return null;
                        }
                    };
                }
            };
        };

        return ['userService', 'interactionService', History];
    });

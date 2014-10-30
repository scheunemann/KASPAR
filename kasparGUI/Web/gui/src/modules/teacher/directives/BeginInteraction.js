'use strict';

define(function(require) {
        var angular = require('angular');
        require('teacher/services/dataProvider');
        var template = require('text!./beginInteraction.tpl.html');

        var BeginInteraction = function(gameService, interactionService) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    teacher: '=',
                    users: '=',
                    games: '=',
                    interaction: '=',
                    onFinished: '&?',
                    onCanceled: '&?',
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.getObjectives = function() {
                        return gameService.getObjectives($scope.games);
                    };

                    $scope.back = function() {
                        if ($scope.onCanceled) {
                            $scope.onCanceled();
                        }
                    };

                    $scope.next = function() {
                        if (!$scope.interaction) {
                            var newInteraction = interactionService.startNewInteraction($scope.teacher, $scope.users);
                            if (newInteraction) {
                                $scope.interaction = newInteraction;
                            }
                        }

                        if ($scope.onFinished) {
                            $scope.onFinished();
                        }
                    };
                }
            };
        };

        return ['gameService', 'interactionService', BeginInteraction];
    });

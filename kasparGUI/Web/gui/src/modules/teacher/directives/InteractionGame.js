'use strict';

define(function(require) {
        var angular = require('angular');
        require('teacher/services/dataProvider');
        var template = require('text!./interactionGame.tpl.html');

        var InteractionGame = function(interactionService, InteractionGame) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    game: '=',
                    interaction: '=',
                    onFinished: '&?',
                    onCanceled: '&?',
                },
                link: function(scope, element, attrs, controller) {
                    scope.showBack = attrs.onCanceled !== undefined;
                    scope.showNext = attrs.onFinished !== undefined;
                },
                controller: function($scope) {
                    $scope.showStart = true;
                    $scope.start = function() {
                        var activeGame = interactionService.getCurrentGame();
                        if (activeGame) {
                            alert("Please finish Play Scenario " + activeGame.name + " first.");
                            return;
                        }

                        interactionService.startNewGame($scope.game);
                        $scope.showStart = false;
                    };

                    $scope.end = function() {
                        interactionService.endGame($scope.game);
                        $scope.showStart = true;
                        $scope.onFinished();
                    };
                }
            };
        };

        return ['interactionService', 'InteractionGame', InteractionGame];
    });

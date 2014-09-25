'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./interactionGame.tpl.html');

        var InteractionGame = function(interactionService, InteractionGame) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    game: '=',
                    interaction: '=',
                },
                link: function(scope, element, attrs, controller) {},
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
                    };
                }
            };
        };

        return ['interactionService', 'InteractionGame', InteractionGame];
    });
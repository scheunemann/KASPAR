'use strict';

define(function(require) {
        var angular = require('angular');
        var _ = require('underscore');
        require('teacher/services/dataProvider');
        var template = require('text!./activeInteraction.tpl.html');

        var ActiveInteraction = function(interactionService) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    interaction: '=',
                    users: '=',
                    games: '=',
                    firstGame: '=',
                    onFinished: '&?',
                    onCanceled: '&?',
                },
                link: function(scope, element, attrs, controller) {
                    scope.showBack = attrs.onCanceled !== undefined;
                    scope.showNext = attrs.onFinished !== undefined;
                },
                controller: function($scope) {
                    $scope.$watch('firstGame', function(game) {
                            $scope.selectedGame = game;
                        });

                    $scope.changeGame = function(game) {
                        if (angular.isArray(game)) {
                            game = game[0];
                        }
                        if (game) {
                            if ($scope.games.indexOf(game) < 0) {
                                $scope.games.push(game);
                            }
                        }

                        $scope.selectedGame = game;
                    };

                    $scope.getPlays = function(game, interactionGames) {
                        if (game && interactionGames) {
                            return _.filter(interactionGames, function(ig) {
                                    return ig.game_id == game.id;
                                }).length;
                        } else {
                            return 0;
                        }
                    };

                    $scope.resumeLast = function() {
                        $scope.selectedGame = $scope.lastGame;
                    };

                    $scope.selectNextGame = function() {
                        $scope.lastGame = $scope.selectedGame;
                        $scope.selectedGame = null;
                    };

                    $scope.next = function() {
                        if (interactionService.getCurrentGame()) {
                            alert('Please finish current game first!');
                        } else {
                            $scope.onFinished();
                        }
                    };
                }
            };
        };

        return ['interactionService', ActiveInteraction];
    });

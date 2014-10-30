'use strict';

define(function(require) {
        var angular = require('angular');
        var _ = require('underscore');
        var template = require('text!./container_interactionGame.tpl.html');

        var Container_Game = function(gameService) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    games: "=",
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.playCounter = 0;
                    $scope.playTime = 'Err';
                    $scope.name = 'Err';
                    $scope.photo_id = null;

                    $scope.$watch('games', function(games) {
                            if (games) {
                                var totTime = 0;
                                _.each(games, function(game) {
                                        if (game.endTime && game.startTime) {
                                            totTime += (new Date(game.endTime) - new Date(game.startTime));
                                        }
                                    });
                                $scope.playTime = totTime;
                                $scope.playCounter = games.length;
                                var game = gameService.getGame(games[0].game_id);
                                $scope.name = game.name;
                                $scope.photo_id = game.photo_id;
                            } else {
                                $scope.playCounter = 0;
                                $scope.playTime = 'Err';
                                $scope.name = 'Err';
                                $scope.photo_id = null;
                            }
                        })
                }
            };
        };

        return ['gameService', Container_Game];
    });

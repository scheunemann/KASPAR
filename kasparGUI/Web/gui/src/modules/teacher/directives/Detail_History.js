'use strict';

define(function(require) {
        var angular = require('angular');
        var _ = require('underscore');
        var template = require('text!./detail_history.tpl.html');

        var Detail_History = function(interactionService, noteService, gameService, userService) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    interaction: "=",
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.images = ['bad.png', 'moderate_bad.png', 'neutral.png', 'moderate_good.png', 'good.png'];
                    $scope.colors = ['bad', 'moderate_bad', 'neutral', 'moderate_good', 'good'];
                    $scope.userService = userService;

                    $scope.addNote = function() {
                        noteService.addNote('', true, $scope.interaction.notes);
                    };

                    $scope.getObjectives = function(interaction) {
                        return interactionService.getObjectives(interaction);
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

                    $scope.getGame = function(game) {
                        if (game) {
                            return gameService.getGame(game.game_id);
                        }
                    };

                    $scope.getPlayTime = function(startTime, endTime) {
                        return gameService.getPlayTime(startTime, endTime);
                    };

                    $scope.$watch('interaction.games', function(interactionGames) {
                            $scope.groupedGames = _.groupBy(interactionGames, 'game_id');
                        });
                }
            };
        };

        return ['interactionService', 'noteService', 'gameService', 'userService', Detail_History];
    });

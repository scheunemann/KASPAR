'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./detail_history.tpl.html');

        var Detail_History = function(interactionService, noteService, gameService) {
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

                    $scope.addNote = function() {
                        noteService.addNote('', true, $scope.interaction.notes);
                    };

                    $scope.getObjectives = function(interaction) {
                        return interactionService.getObjectives(interaction);
                    };

                    $scope.getAverageScore = function() {
                        if (arguments.length) {
                            var total = 0;
                            for(var i = 0; i < arguments.length; i++) {
                                total += arguments[i];
                            }
                            return Math.round((total / arguments.length) - 1);
                        } else {
                            return null;
                        }
                    };

                    $scope.getGame = function(game) {
                        if (game) {
                            return gameService.getGame(game.game_id);
                        }
                    }

                    $scope.getPlayTime = function(startTime, endTime) {
                        if (startTime && endTime) {
                            var ts = new Date(endTime) - new Date(startTime);
                            var hours = Math.floor(ts / (1000 * 60 * 60));
                            var rest = ts % (1000 * 60 * 60);
                            var minutes = Math.floor(rest / (1000 * 60));
                            rest = rest % (1000 * 60);
                            var seconds = Math.round(rest / 1000);
                            if (hours) {
                                return hours + 'h' + minutes + 'm' + seconds + 's';
                            } else if (minutes) {
                                return minutes + 'm' + seconds + 's';
                            } else {
                                return seconds + 's';
                            }
                        } else {
                            return 'Err';
                        }
                    };
                }
            };
        };

        return ['interactionService', 'noteService', 'gameService', Detail_History];
    });

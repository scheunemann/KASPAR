'use strict';

define(function(require) {
        var angular = require('angular');
        var _ = require('underscore');
        require('teacher/services/dataProvider');
        var template = require('text!./endInteraction.tpl.html');

        var EndInteraction = function(interactionService, noteService, gameService, userService, $modal, Note) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    interaction: '=',
                    users: '=',
                    onFinished: '&?',
                    onCanceled: '&?',
                },
                link: function(scope, element, attrs, controller) {
                    scope.showBack = attrs.onCanceled !== undefined;
                    scope.showNext = attrs.onFinished !== undefined;
                },
                controller: function($scope) {
                    $scope.images = ['bad.png', 'moderate_bad.png', 'neutral.png', 'moderate_good.png', 'good.png'];
                    $scope.colors = ['bad', 'moderate_bad', 'neutral', 'moderate_good', 'good'];
                    $scope.userService = userService;
                    $scope.getObjectives = function() {
                        return interactionService.getObjectives($scope.interaction);
                    };

                    $scope.next = function() {
                        var exp = _.pluck($scope.interaction.users, 'experience');
                        var eng = _.pluck($scope.interaction.users, 'engagement');
                        if (_.every(exp) && _.every(eng) && $scope.interaction.operatorExperience) {
                            interactionService.endInteraction($scope.interaction);
                            $scope.onFinished();
                        } else {
                            alert('Please report your experience by clicking on the images');
                        }
                    };

                    $scope.getGame = function(game) {
                        if (game) {
                            return gameService.getGame(game.game_id);
                        }
                    };

                    $scope.addNote = function(title) {
                        noteService.addNote(title, !title, $scope.interaction.notes);
                    };

                    $scope.editNote = function(note) {
                        noteService.editNote(note);
                    };
                }
            };
        };

        return ['interactionService', 'noteService', 'gameService', 'userService', '$modal', 'Note', EndInteraction];
    });

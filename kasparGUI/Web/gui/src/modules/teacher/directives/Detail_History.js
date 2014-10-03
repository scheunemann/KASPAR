'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./detail_history.tpl.html');

        var Detail_History = function(interactionService, noteService) {
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
                        noteService.addNote('', $scope.interaction.notes);
                    };

                    $scope.getObjectives = function() {
                        return interactionService.getObjectives($scope.interaction);
                    };

                    $scope.getPlayTime = function(startTime, endTime) {
                        var hours = Math.floor((endTime - startTime) / (60000 / 60));
                        var minutes = Math.round((endTime - startTime) / (60000 % 60));
                        return hours + 'h' + minutes + 'm';
                    };
                }
            };
        };

        return ['interactionService', 'noteService', Detail_History];
    });

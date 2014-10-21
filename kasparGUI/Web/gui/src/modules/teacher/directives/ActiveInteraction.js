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
                    user: '=',
                    games: '=',
                    onFinished: '=?',
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.changeGame = function(game) {
                        $scope.selectedGame = game;
                    };

                    $scope.getPlays = function(game, interactionGames) {
                        if(game && interactionGames) {
                            return _.filter(interactionGames, function(ig) {return ig.game_id == game.id}).length;
                        } else {
                            return 0;
                        }
                    };

                    $scope.endInteraction = function() {
                        if (interactionService.getCurrentGame()) {
                            alert('Please finish current game first!');
                        } else {
                            if ($scope.onFinished) {
                                $scope.onFinished();
                            }
                        }
                    };
                }
            };
        };

        return ['interactionService', ActiveInteraction];
    });

'use strict';

define(function(require) {
        var angular = require('angular');
        var _ = require('underscore');

        var InteractionService = function($q, Interaction, InteractionGame) {
            this.getInteractions = function() {
                return Interaction.query();
            }

            var getInteractionGameObjectives = function(game) {
                if (!game) {
                    return null;
                }

                var gamePromise = $q.defer();
                game.$getProperty('game').$promise.then(function(game) {
                        gamePromise.resolve(game.objectives);
                    });

                return gamePromise.promise;
            };


            //cache objectives to prevent infdig errors
            var lastGames = [];
            var lastObjectives = [];

            this.getObjectives = function(interaction) {
                if (!interaction || !interaction.games) {
                    return null;
                }

                if (_.difference(lastGames, interaction.games).length == 0 && _.difference(interaction.games, lastGames).length == 0) {
                    // games haven't changed, return same array as previous
                    return lastObjectives;
                }

                var promises = [];
                for (var i = 0; i < interaction.games.length; i++) {
                    var interactionGame = interaction.games[i];
                    promises.push(getInteractionGameObjecives(interactionGame));
                }

                var deferred = $q.defer();
                $q.all(promises).then(function(objectives) {
                        //deferred.resolve(_.uniq(objectives, false, _.iteratee('name')));
                    });

                lastObjectives = deferred.promise;
                lastGames = interaction.games
                return deferred.promise;
            };

            var activeGame = null;
            var activeInteraction = null;
            var activeInteractionGame = null;
            this.getCurrentGame = function() {
                return activeGame;
            };

            this.startNewGame = function(game) {
                if (!game) {
                    console.log("NULL Value received for game");
                    return;
                }

                var newGame = new InteractionGame({
                        game_id: $scope.game.id,
                        interaction_id: $scope.interaction.id,
                        startTime: Date.now(),
                    });

                activeGame.$save(function() {
                        activeInteraction.games.push(activeGame);
                        activeGame = newGame;
                    });
            };

            this.endGame = function(game) {
                if (!game) {
                    console.log("NULL Value received for game");
                    return;
                }

                activeInteractionGame.endTime = Date.now();
                activeInteractionGame.$save(function() {
                        activeGame = null;
                    });
            }

            this.startNewInteraction = function(operator, user) {
                if (!operator || !user) {
                    console.log("NULL Value received for operator or user");
                    return;
                }

                this.endInteraction();

                var newInteraction = new Interaction({
                        user_id: user.id,
                        operator_id: operator.id,
                        startTime: Date.now(),
                    });

                newInteraction.$save();
                activeInteraction = newInteraction;
                return newInteraction;
            }

            this.endInteraction = function(interaction) {
                if (!interaction) {
                    console.log("WARNING: Null interaction received");
                    return;
                }

                if (interaction !== activeInteraction) {
                    console.log("WARNING: Attempted to end wrong interaction!");
                }

                if (interaction && !interaction.endTime) {
                    interaction.endTime = Date.now();
                    interaction.$save();
                }

                activeInteraction = null;
            }
        };

        return ['$q', 'Interaction', 'InteractionGame', InteractionService];
    });
'use strict';

define(function(require) {
        var angular = require('angular');
        require('teacher/models');
        var _ = require('underscore');

        var InteractionService = function($q, $log, Interaction, InteractionGame, Game) {
            var interactions = Interaction.query();

            this.getInteractions = function() {
                return interactions;
            };

            var getInteractionGameObjectives = function(game) {
                if (!game) {
                    return null;
                }

                var gamePromise = $q.defer();
                if (game.id && game.$getProperty) {
                    game.$getProperty('game').$promise.then(function(game) {
                            gamePromise.resolve(game.objectives);
                        });
                } else {
                    Game.get({
                            id: game.game_id
                        }, function(game) {
                            gamePromise.resolve(game.objectives);
                        });
                }

                return gamePromise.promise;
            };


            //cache objectives to prevent infdig errors
            var lastGames = [];
            var lastObjectives = [];

            this.getObjectives = function(interaction) {
                if (!interaction || !interaction.games) {
                    return null;
                }

                if (_.difference(lastGames, interaction.games).length === 0 && _.difference(interaction.games, lastGames).length === 0) {
                    // games haven't changed, return same array as previous
                    return lastObjectives;
                }

                var promises = [];
                for (var i = 0; i < interaction.games.length; i++) {
                    var interactionGame = interaction.games[i];
                    promises.push(getInteractionGameObjectives(interactionGame));
                }

                var deferred = $q.defer();
                $q.all(promises).then(function(objectives) {
                        //deferred.resolve(_.uniq(objectives, false, _.iteratee('name')));
                    });

                lastObjectives = deferred.promise;
                lastGames = interaction.games;
                return deferred.promise;
            };

            var activeGame = null;
            var activeInteraction = null;
            this.getCurrentGame = function() {
                return activeGame;
            };

            this.getCurrentInteraction = function() {
                return activeInteraction;
            };

            this.getPlayCount = function(game) {
                if (!game) {
                    $log.info("NULL Value received for game");
                    return;
                }

                if (!activeInteraction) {
                    $log.info("No active interaction");
                    return;
                }

                return _.filter(activeInteraction.games, 
                                function(intGame) {return intGame.game_id == game.id;}
                               ).length;
            }

            this.startNewGame = function(game) {
                if (!game) {
                    $log.info("NULL Value received for game");
                    return;
                }

                var newGame = new InteractionGame({
                        game_id: game.id,
                        interaction_id: activeInteraction.id,
                        startTime: new Date(),
                    });

                activeInteraction.games.push(newGame);
                activeGame = newGame;
                activeGame.$save();
            };

            this.endGame = function(game) {
                if (!activeGame) {
                    return;
                }

                if (activeGame.game_id !== game.id) {
                    $log.warn("WARNING: Attempted to end wrong game!");
                }

                if (!activeGame.endTime) {
                    activeGame.endTime = new Date();
                    activeGame.$save();
                }

                activeGame = null;
            };

            this.startNewInteraction = function(operator, user) {
                if (!operator || !user) {
                    $log.info("NULL Value received for operator or user");
                    return;
                }

                if (activeInteraction) {
                    this.endInteraction(activeInteraction);
                }

                var newInteraction = new Interaction({
                        user_id: user.id,
                        operator_id: operator.id,
                        startTime: new Date(),
                        games: [],
                    });

                newInteraction.$save();
                activeInteraction = newInteraction;
                interactions.push(newInteraction);
                return newInteraction;
            };

            this.endInteraction = function(interaction) {
                if (!interaction) {
                    $log.warn("WARNING: Null interaction received");
                    return;
                }

                if (interaction !== activeInteraction) {
                    $log.warn("WARNING: Attempted to end wrong interaction!");
                }

                if (!interaction.endTime) {
                    interaction.endTime = new Date();
                    interaction.$save();
                }

                activeInteraction = null;
            };
        };

        return ['$q', '$log', 'Interaction', 'InteractionGame', 'Game', InteractionService];
    });

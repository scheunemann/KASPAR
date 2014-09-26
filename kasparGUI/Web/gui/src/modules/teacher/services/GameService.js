'use strict';

define(function(require) {
        var angular = require('angular');
        var _ = require('underscore');

        var GameService = function($q, Game) {
            var games = Game.query();

            this.getGames = function() {
                return games;
            };

            //cache objectives to prevent infdig errors
            var lastObjectives = [];
            var lastGames = [];

            this.getGame = function(gameId) {
                var game = _.find(games, function(game) {return game.id == gameId;});
                if (!game) {
                    game = Game.get({id: gameId});
                    games.push(game);
                }

                return game;
            };

            this.getObjectives = function(games) {
                if (!games) {
                    return null;
                }

                if (_.difference(lastGames, games).length === 0 && _.difference(games, lastGames).length === 0) {
                    // games haven't changed, return same array as previous
                    return lastObjectives;
                }

                var promises = [];
                for (var i = 0; i < games.length; i++) {
                    var game = games[i];
                    promises.push(game.$getProperty('objectives').$promise);
                }

                var deferred = $q.defer();
                $q.all(promises).then(function(objectives) {
                        deferred.resolve(_.uniq(objectives, false, _.iteratee('name')));
                    });

                lastObjectives = deferred.promise;
                lastGames = games;
                return deferred.promise;
            };
        };

        return ['$q', 'Game', GameService];
    });

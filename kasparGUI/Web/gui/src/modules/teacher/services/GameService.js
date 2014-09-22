'use strict';

define(function(require) {
        var angular = require('angular');

        var GameService = function($q, Game) {
            this.getGames = function() {
                return Game.query();
            }

            this.getObjectives = function(games) {
                if(!games) {
                    return null;
                }

                var promises = [];
                for (var i = 0; i < games.length; i++) {
                    var game = games[i];
                    promises.push(game.$getProperty('objectives').$promise);
                }

                var deferred = $q.all(promises);
                deferred.then(function(objectives) {
                        deferred.resolve(_.uniq(objectives, false, _.iteratee('name')));
                    });

                return deferred;
            };
        };

        return ['$q', 'Game', GameService];
    });
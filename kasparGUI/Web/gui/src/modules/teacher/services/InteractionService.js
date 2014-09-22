'use strict';

define(function(require) {
	var angular = require('angular');
	var _ = require('underscore');

	var InteractionService = function($q, Interaction, InteractionGame) {
		this.getInteractions = function() {
			return Interaction.query();
		}

		var getInteractionGameObjectives = function(game) {
			var gamePromise = $q.defer();
			game.$getProperty('game').$promise.then(function(game) {
				gamePromise.resolve(game.objectives);
			});

			return gamePromise.promise;
		};

		this.getObjectives = function(interaction) {
			var promises = [];
			if (interaction && interaction.games) {
				for (var i = 0; i < interaction.games.length; i++) {
					var interactionGame = interaction.games[i];
					promises.push(getInteractionGameObjecives(interactionGame));
				}
			}

			var deferred = $q.all(promises);
			deferred.then(function(objectives) {
				return _.uniq(objectives, false, _.iteratee('name'));
			});

			return deferred;
		};

		var activeGame = null;
		var activeInteraction = null;
		var activeInteractionGame = null;
		this.getCurrentGame = function() {
			return activeGame;
		};

		this.startNewGame = function(game) {
			var newGame = new InteractionGame({
				game_id : $scope.game.id,
				interaction_id : $scope.interaction.id,
				startTime : Date.now(),
			});

			activeGame.$save(function() {
				activeInteraction.games.push(activeGame);
				activeGame = newGame;
			});
		};

		this.endGame = function(game) {
			activeInteractionGame.endTime = Date.now();
			activeInteractionGame.$save(function() {
				activeGame = null;
			});
		}

		this.startNewInteraction = function(operator, user) {
			this.endInteraction();

			var newInteraction = new Interaction({
				user_id : user.id,
				operator_id : operator.id,
				startTime : Date.now(),
			});

			newInteraction.$save();
			activeInteraction = newInteraction;
			return newInteraction;
		}

		this.endInteraction = function(interaction) {
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

	return [ '$q', 'Interaction', 'InteractionGame', InteractionService ];
});

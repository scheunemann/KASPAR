'use strict';

define(function(require) {
	var angular = require('angular');
	var languageServices = require('common/i18n/languageServices');
	var actionModels = require('actions/models');
	var gameModels = require('games/models');
	var gameDirectives = require('games/directives');
	var GameController = require('./GameController');

	var moduleName = 'kasparGUI.games.controllers';
	var dependancies = [
						actionModels,
						languageServices,
						gameModels,
						gameDirectives,
						];

	var module = angular.module(moduleName, dependancies)
		.controller('gameController', GameController);

	return moduleName;
});

'use strict';

define(function(require) {
	var angular = require('angular');
	var GameService = require('./GameService'); 
	var InteractionService = require('./InteractionService'); 
	var ObjectiveService = require('./objectiveService'); 
	var ScenarioService = require('./scenarioService'); 
	var UserService = require('./UserService'); 

	var moduleName = 'kasparGUI.teacher.dataProvider';
	var dependancies = [];

	var module = angular.module(moduleName, dependancies)
		.service('gameService', GameService)
		.service('interactionService', InteractionService)
		.service('objectiveService', ObjectiveService)
		.service('scenarioService', ScenarioService)
		.service('userService', UserService);

	return moduleName;
});

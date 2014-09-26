'use strict';

define(function(require) {
        var angular = require('angular');
        var Game = require('./models/Game');
        var Note = require('./models/Note');
        var Objective = require('./models/Objective');
        var Tag = require('./models/Tag');
        var Interaction = require('./models/Interaction');
        var InteractionLog = require('./models/InteractionLog');
        var InteractionGame = require('./models/InteractionGame');

        var moduleName = 'kasparGUI.teacher.models';
        var dependancies = [];

        var module = angular.module(moduleName, dependancies)
            .factory('Note', Note)
            .factory('Game', Game)
            .factory('Tag', Tag)
            .factory('Objective', Objective)
            .factory('Interaction', Interaction)
            .factory('InteractionLog', InteractionLog)
            .factory('InteractionGame', InteractionGame);

        return moduleName;
    });

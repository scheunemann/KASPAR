'use strict';

define(function(require) {
        var angular = require('angular');
        var languageServices = require('common/i18n/languageServices');
        var dataProvider = require('teacher/services/dataProvider');
        var authenticationService = require('teacher/services/authenticationService');
        var ActiveInteraction = require('./directives/ActiveInteraction');
        var BeginInteraction = require('./directives/BeginInteraction');
        var SelectGames = require('./directives/SelectGames');
        var Container_Game = require('./directives/Container_Game');
        var Container_InteractionGame = require('./directives/Container_InteractionGame');
        var Container_Note = require('./directives/Container_Note');
        var Container_Objective = require('./directives/Container_Objective');
        var Container_Tag = require('./directives/Container_Tag');
        var Container_User = require('./directives/Container_User');
        var Detail_Game = require('./directives/Detail_Game');
        var Detail_History = require('./directives/Detail_History');
        var EndInteraction = require('./directives/EndInteraction');
        var Games = require('./directives/Games');
        var History = require('./directives/History');
        var Home = require('./directives/Home');
        var InteractionGame = require('./directives/InteractionGame');
        var Interaction = require('./directives/Interaction');
        var Login = require('./directives/Login');
        var Portal = require('./directives/Portal');
        var Objectives = require('./directives/Objectives');
        var SelectUsers = require('./directives/SelectUsers');
        var ActionButton = require('./directives/ActionButton');
        var ActionButtons = require('./directives/ActionButtons');

        var moduleName = 'kasparGUI.teacher.directives';
        var dependancies = [
            languageServices,
            dataProvider,
            authenticationService,
        ];

        var module = angular.module(moduleName, dependancies)
            .directive('activeInteraction', ActiveInteraction)
            .directive('beginInteraction', BeginInteraction)
            .directive('selectGames', SelectGames)
            .directive('containerGame', Container_Game)
            .directive('containerInteractionGame', Container_InteractionGame)
            .directive('containerNote', Container_Note)
            .directive('containerObjective', Container_Objective)
            .directive('containerTag', Container_Tag)
            .directive('containerUser', Container_User)
            .directive('detailGame', Detail_Game)
            .directive('detailHistory', Detail_History)
            .directive('endInteraction', EndInteraction)
            .directive('games', Games)
            .directive('history', History)
            .directive('home', Home)
            .directive('interactionGame', InteractionGame)
            .directive('interaction', Interaction)
            .directive('login', Login)
            .directive('portal', Portal)
            .directive('objectives', Objectives)
            .directive('selectUsers', SelectUsers)
            .directive('actionButton', ActionButton)
            .directive('actionButtons', ActionButtons);

        return moduleName;
    });

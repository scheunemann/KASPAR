'use strict';

define(function(require) {
        var angular = require('angular');
        require('actions/models');
        require('triggers/models');
        require('users/models');

        var UserController = function($scope, $filter, User, CustomAction, CustomTrigger, Action, Trigger, language) {
            $scope.language = language.getText();
            $scope.users = User.query();

            $scope.$watch('selectedUser', function(user) {
                    if (user !== undefined && user.speedmodifier === undefined) {
                        user.speedmodifier = 100;
                    }
                });
        };

        return ['$scope', '$filter', 'User', 'CustomAction', 'CustomTrigger', 'Action', 'Trigger', 'language', UserController];

    });

'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./interaction.tpl.html');

        var Interaction = function() {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    teacher: '=',
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.reset = function() {
                        $scope.users = undefined;
                        $scope.selectedGames = undefined;
                        $scope.interaction = undefined;
                        $scope.state = 'selectUsers';
                    };

                    $scope.setState = function(state) {
                        $scope.state = state;
                    };

                    $scope.reset();
                }
            };
        };

        return Interaction;
    });

'use strict';

define(function(require) {
        var angular = require('angular');
        require('teacher/models');
        var template = require('text!./actionButton.tpl.html');

        var ActionButton = function(InteractionLog) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    trigger: "=",
                    interaction: "=",
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.$watch('trigger', function(newValue, oldValue) {
                            if (newValue !== undefined && newValue.hotKeys !== undefined) {
                                var kb = [];
                                for (var i = 0; i < newValue.hotKeys.length; i++) {
                                    kb.push(newValue.hotKeys[i].keyString);
                                }

                                $scope.keyDisplay = kb.join(' | ');
                            }
                        });

                    $scope.callTrigger = function(triggerId) {
                        if ($scope.interaction && $scope.interaction.id) {
                            InteractionLog.save({
                                    interactionId: $scope.interaction.id
                                }, {
                                    'trigger_id': triggerId,
                                    'interaction_id': $scope.interaction.id,
                                    'source': 'OPERATOR',
                                });
                        } else {
                            console.log("Missing interaction id");
                        }	
                    };
                }
            };
        };

        return ['InteractionLog', ActionButton];
    });

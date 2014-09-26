'use strict';

define(function(require) {
        var angular = require('angular');
        require('common/services/displayServices');
        require('actions/models');
        var Mousetrap = require('mousetrap');
        var template = require('text!./actionButton.tpl.html');

        var ActionButton = function($q, $timeout, InteractionLog, hotkeyFormatter, language) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    button: "=",
                    interaction: "=",
                    showHotKeys: "=",
                    keyBind: "=",
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.language = language.getText();
                    $scope.active = false;
                    var keyBinds = null;

                    $scope.$watch('button', function(newValue, oldValue) {
                            if (newValue !== undefined) {
                                var kb = [];
                                for (var i = 0; i < $scope.button.hotKeys.length; i++) {
                                    kb.push($scope.button.hotKeys[i].keyString);
                                }

                                $scope.keyDisplay = kb.join(' | ');
                                if (keyBinds !== null) {
                                    Mousetrap.unbind(keyBinds);
                                }

                                keyBinds = [];
                                for (var i = 0; i < kb.length; i++) {
                                    var key = kb[i];
                                    keyBinds.push(key);
                                    if (key.toLowerCase() != key) {
                                        keyBinds.push(key.toLowerCase());
                                    }
                                }

                                Mousetrap.bind(keyBinds, function() {
                                        $scope.active = true;
                                        $timeout(function() {
                                                $scope.active = false;
                                            }, 2000);
                                        if ($scope.keyBind) {
                                            $scope.callButton($scope.button.id);
                                            return false;
                                        }
                                    });
                            }
                        });

                    $scope.callButton = function(buttonId) {
                        InteractionLog.save({
                                interactionId: $scope.interaction.id
                            }, {
                                'button_id': buttonId,
                                'interaction_id': $scope.interaction.id
                            });
                    };
                }
            };
        };

        return ['$q', '$timeout', 'InteractionLog', 'hotkeyFormatter', 'language', ActionButton];
    });
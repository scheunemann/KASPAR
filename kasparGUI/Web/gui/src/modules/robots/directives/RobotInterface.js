'use strict';

define(function(require) {
        var angular = require('angular');
        require('common/models');
        require('robots/models');
        require('robots/services/interfaceServices');
        var template = require('text!./robotInterface.tpl.html');

        var RobotInterface = function($q, Robot, robotInterface, Setting, language) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    robot: "=",
                    connected: "=?",
                    showConnect: "=?"
                },
                controller: function($scope) {
                    $scope.language = language.getText();

                    var settings = Setting.query({
                            'key': 'robot'
                        });
                    $scope.robots = Robot.query();

                    $scope.robots.$promise.then(function() {
                            settings.$promise.then(function() {
                                    if (settings.length > 0) {
                                        for (var i = 0; i < $scope.robots.length; i++) {
                                            if ($scope.robots[i].name == settings[0].value) {
                                                $scope.robot = $scope.robots[i];
                                                $scope.configured = true;
                                                break;
                                            }
                                        }
                                    }
                                });
                        });

                    $scope.$watch('robot', function(robot) {
                            robotInterface.setRobot(robot);
                            $scope.connected = robotInterface.getConnected();
                        });

                    $scope.$watch('connected', function(connected) {
                            $scope.setConnected(connected);
                        });

                    $scope.setConnected = function(state) {
                        if (state) {
                            robotInterface.setConnected(state);
                        } else {
                            robotInterface.setConnected(false);
                        }

                        $scope.connected = state;
                    };

                    if ($scope.connected === undefined) {
                        $scope.connected = true;
                    }

                    if ($scope.showConnect === undefined) {
                        $scope.showConnect = false;
                    }
                }
            };
        };

        return ['$q', 'Robot', 'robotInterface', 'Setting', 'language', RobotInterface];
    });

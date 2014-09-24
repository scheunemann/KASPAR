'use strict';

define(function(require) {
        var angular = require('angular');
        var _ = require('underscore');
        require('actions/models');
        require('actions/directives');
        require('common/directives');

        var ActionController = function($scope, $http, Action, ActionType, language) {
            $scope.typeFilter = {
                type: '',
            };
            $scope.language = language.getText();
            $scope.actions = Action.query();
            $scope.type = null;
            $scope.types = ActionType.query();
            $scope.types.$promise.then(function(types) {
                    var action = {
                        name: 'Action'
                    };
                    $scope.types.push(action);
                    $scope.type = action;
                });

            $scope.$watch('type', function(type, old) {
                    if (type && type.name != 'Action') {
                        $scope.typeFilter.type = type.name;
                    } else {
                        $scope.typeFilter.type = '';
                    }
                });

            $scope.$watch('action', function(action) {
                    if (action !== undefined && action !== null) {
                        var abstractAction = $scope.action;
                        var concreteAction = $scope.action.getConcreteClassInstance();
                        concreteAction.$promise.then(function() {
                                $scope.actions[$scope.actions.indexOf(abstractAction)] = concreteAction;
                                $scope.action = concreteAction;
                            });
                    }

                    if (action && !_.find($scope.actions, action)) {
                        $scope.actions.push(action);
                    }
                });

            $scope.newAction = function() {
                $scope.action = new Action({
                        type: $scope.type.name || 'Action',
                    });
                $scope.actions.push($scope.action);
            };

            $scope.deleteAction = function(action) {
                $scope.actions.splice($scope.actions.indexOf(action), 1);
                $scope.action = undefined;
                if (action.$delete != undefined) {
                    action.$delete();
                }
            };

            var errorFunc = function(status) {
                console.log("Error sending file:" + status);
            };

            var successFunc = function(data, status, headers, config) {
                $scope.newobjs.push(data);
            };

            $scope.importFiles = function(files) {

                for (var i = 0; i < files.length; i++) {
                    var fd = new FormData();
                    fd.append("data", files[i]);

                    var obj = $http.post('/api/Action/Import', fd, {
                            headers: {
                                'Content-Type': undefined
                            },
                            transformRequest: angular.identity
                        }).success(successFunc).error(errorFunc);
                }
            };
        };

        return ['$scope', '$http', 'Action', 'ActionType', 'language', ActionController];
    });
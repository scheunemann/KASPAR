'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./userEditor.tpl.html');
        var _ = require('underscore');

        var UserService = function(User, $modal, $log) {
            this.getUsers = function() {
                return User.query();
            };

            this.addUser = function(name, users) {
                var user = _.findWhere(users, {
                        name: name
                    });
                if (!user) {
                    user = new User({
                            name: name
                        });
                }

                var modalInstance = $modal.open({
                        template: template,
                        controller: function($scope, $modalInstance, user) {

                            $scope.user = user;

                            $scope.ok = function() {
                                $modalInstance.close($scope.note);
                            };

                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                            };
                        },
                        resolve: {
                            user: function() {
                                return user;
                            },
                        }
                    });

                modalInstance.result.then(function(user) {
                        if (userss.indexOf(user) <= 0) {
                            users.push(user);
                        }
                    }, function(reason) {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
            };
        };

        return ['User', '$modal', '$log', UserService];
    });

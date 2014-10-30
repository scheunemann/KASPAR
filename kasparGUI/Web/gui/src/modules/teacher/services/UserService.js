'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./userEditor.tpl.html');
        var _ = require('underscore');

        var UserService = function(User, $modal, $log) {
            var users = null;
            this.getUsers = function() {
                if (!users) {
                    users = User.query();
                }

                return users;
            };

            this.getUser = function(user_id) {
                return _.find(users, function(user) {
                        return user.id == user_id;
                    });
            };

            this.editUser = function(user) {
                var modalInstance = $modal.open({
                        template: template,
                        controller: function($scope, $modalInstance, user) {

                            $scope.user = user;
                            $scope.dateOpen = true;

                            $scope.ok = function() {
                                $scope.user.$save();
                                $modalInstance.close($scope.user);
                            };

                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                            };

                            $scope.openDatePicker = function($event) {
                                $event.preventDefault();
                                $event.stopPropagation();

                                $scope.dateOpen = true;
                            };
                        },
                        resolve: {
                            user: function() {
                                return user;
                            },
                        }
                    });

                return modalInstance.result;
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

                this.editUser(user).then(function(user) {
                        if (users.indexOf(user) <= 0) {
                            users.push(user);
                        }
                    });
            };
        };

        return ['User', '$modal', '$log', UserService];
    });

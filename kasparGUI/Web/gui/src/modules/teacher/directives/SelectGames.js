'use strict';

define(function(require) {
        var angular = require('angular');
        var _ = require('underscore');
        var template = require('text!./selectGames.tpl.html');
        require('teacher/services/dataProvider');

        var SelectGames = function(gameService) {
            return {
                template: template,
                restrict: 'E',
                scope: {
                    teacher: '=',
                    users: '=',
                    selectedGames: '=',
                    onFinished: '&?',
                    onCanceled: '&?',
                    multiple: '=?',
                },
                link: function(scope, element, attrs, controller) {},
                controller: function($scope) {
                    $scope.selected = [];
                    $scope.games = gameService.getGames();
                    $scope.objectives = [];
                    if ($scope.multiple === undefined) {
                        $scope.multiple = true;
                    }

                    $scope.$watch('users', function(newUsers, oldUsers) {
                            if (newUsers) {
                                var args = [0, $scope.objectives.length];
                                var objectives = _.union(_.flatten(_.pluck(newUsers, 'objectives')));
                                $scope.objectives.splice.apply($scope.objectives, args.concat(objectives));
                            } else {
                                $scope.objectives.splice(0, $scope.objectives.length);
                            }
                        });

                    $scope.$watch('objectives', function(objectives) {
                            $scope.selected = [];
                            if (objectives !== null && objectives !== undefined && $scope.games) {
                                for (var i = 0; i < $scope.games.length; i++) {
                                    if ($scope.itemFilter($scope.games[i])) {
                                        $scope.selected.push($scope.games[i]);
                                    }
                                }
                            }
                        });

                    $scope.itemFilter = function(element) {
                        if (element && element.objectives && $scope.objectives) {
                            for (var i = 0; i < element.objectives.length; i++) {
                                for (var j = 0; j < $scope.objectives.length; j++) {
                                    if (element.objectives[i].tag == $scope.objectives[j].tag) {
                                        return true;
                                    }
                                }
                            }
                        }

                        return false;
                    };

                    $scope.selectGame = function(game) {
                        if (!$scope.selected) {
                            $scope.selected = [];
                        }

                        if ($scope.multiple) {
                            for (var i = 0; i < $scope.selected.length; i++) {
                                if ($scope.selected[i] == game) {
                                    $scope.selected.splice(i, 1);
                                    return;
                                }
                            }

                            $scope.selected.push(game);
                        } else {
                            $scope.selected = [game];
                        }
                    };

                    $scope.back = function() {
                        if ($scope.onCanceled) {
                            $scope.onCanceled();
                        }
                    };

                    $scope.next = function() {
                        $scope.selectedGames = $scope.selected;
                        if ($scope.onFinished) {
                            $scope.onFinished({selectedGames: $scope.selectedGames});
                        }
                    };

                    $scope.isSelected = function(game) {
                        if ($scope.selected) {
                            for (var i = 0; i < $scope.selected.length; i++) {
                                if ($scope.selected[i] == game) {
                                    return true;
                                }
                            }
                        }

                        return false;
                    };
                }
            };
        };

        return ['gameService', SelectGames];
    });

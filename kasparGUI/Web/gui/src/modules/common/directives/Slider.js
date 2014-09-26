'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./slider.tpl.html');

        var Slider = function(language) {
            return {
                template: template,
                restrict: 'EA',
                replace: true,
                scope: {
                    name: "=",
                    value: "=?",
                    floor: "=?",
                    ceiling: "=?",
                    step: "=?",
                    precision: "=?",
                },
                compile: function(element, attr) {
                    //element[0].removeAttribute('name');
                    element[0].removeAttribute('floor');
                    element[0].removeAttribute('ceiling');
                    element[0].removeAttribute('step');
                    element[0].removeAttribute('guislider');
                    element[0].removeAttribute('precision');
                },
                controller: function($scope, language) {
                    $scope.language = language.getText();
                    if ($scope.floor === undefined) {
                        $scope.floor = 0;
                    }
                    if ($scope.ceiling === undefined) {
                        $scope.ceiling = 100;
                    }
                    if ($scope.step === undefined) {
                        $scope.step = 1;
                    }
                    if ($scope.precision === undefined) {
                        $scope.precision = 0;
                    }
                    if ($scope.value === undefined) {
                        $scope.value = 0;
                    }
                },
            };
        };

        return ['language', Slider];
    });

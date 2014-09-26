'use strict';

define(function(require) {
        var angular = require('angular');
        require('actions/models');
        require('triggers/models');
        require('robots/models');

        var GameController = function($scope, language) {
            $scope.language = language.getText();
        };

        return ['$scope', 'language', GameController];
    });

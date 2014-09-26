'use strict';

define(function(require) {
        var Game = function(modelBuilder) {
            var _service = modelBuilder.getModel('Game');

            return _service;
        };

        return ['modelBuilder', Game];
    });

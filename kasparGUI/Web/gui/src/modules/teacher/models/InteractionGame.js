'use strict';

define(function(require) {
        var InteractionGame = function(modelBuilder) {
            var _service = modelBuilder.getModel('InteractionGame');

            return _service;
        };

        return ['modelBuilder', InteractionGame];
    });

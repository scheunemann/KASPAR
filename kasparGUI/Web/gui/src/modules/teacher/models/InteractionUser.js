'use strict';

define(function(require) {
        var InteractionUser= function(modelBuilder) {
            var _service = modelBuilder.getModel('InteractionUser');

            return _service;
        };

        return ['modelBuilder', InteractionUser];
    });

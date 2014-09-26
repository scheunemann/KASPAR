'use strict';

define(function(require) {
        var Tag = function(modelBuilder) {
            var _service = modelBuilder.getModel('Tag');

            return _service;
        };

        return ['modelBuilder', Tag];
    });

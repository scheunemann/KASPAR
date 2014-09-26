'use strict';

define(function(require) {
        var CustomTrigger = function(modelBuilder) {
            var _service = modelBuilder.getModel('CustomTrigger');

            return _service;
        };

        return ['modelBuilder', CustomTrigger];
    });

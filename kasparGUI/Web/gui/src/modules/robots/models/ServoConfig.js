'use strict';

define(function(require) {
        var ServoConfig = function(modelBuilder) {
            var _service = modelBuilder.getModel('ServoConfig');

            return _service;
        };

        return ['modelBuilder', ServoConfig];
    });

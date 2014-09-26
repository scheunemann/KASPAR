'use strict';

define(function(require) {
        var SensorGroup = function(modelBuilder) {
            var _service = modelBuilder.getModel('SensorGroup');

            return _service;
        };

        return ['modelBuilder', SensorGroup];
    });

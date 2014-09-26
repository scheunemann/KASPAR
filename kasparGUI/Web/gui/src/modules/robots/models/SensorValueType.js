'use strict';

define(function(require) {
        var SensorValueType = function(modelBuilder) {
            var resource = modelBuilder.getModel('SensorValueType');

            return resource;
        };

        return ['modelBuilder', SensorValueType];
    });

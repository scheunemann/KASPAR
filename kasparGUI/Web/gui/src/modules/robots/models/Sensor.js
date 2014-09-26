'use strict';

define(function(require) {
        var Sensor = function(modelBuilder) {
            var resource = modelBuilder.getModel('Sensor');

            return resource;
        };

        return ['modelBuilder', Sensor];
    });

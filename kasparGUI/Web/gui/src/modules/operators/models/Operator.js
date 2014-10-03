'use strict';

define(function(require) {
        var Operator = function(modelBuilder) {
            var _service = modelBuilder.getModel('Operator');

            return _service;
        };

        return ['modelBuilder', Operator];
    });

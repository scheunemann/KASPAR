'use strict';

define(function(require) {
        var Menu = function(modelBuilder) {
            return modelBuilder.getModel('Menu');
        };

        return ['modelBuilder', Menu];
    });

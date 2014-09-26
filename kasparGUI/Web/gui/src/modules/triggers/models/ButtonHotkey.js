'use strict';

define(function(require) {
        var ButtonHotkey = function(modelBuilder) {
            var _service = modelBuilder.getModel('ButtonHotkey');

            return _service;
        };

        return ['modelBuilder', ButtonHotkey];
    });

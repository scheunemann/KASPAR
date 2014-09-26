'use strict';

define(function(require) {
        require('angular');
        var FileModel = function($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function() {
                            scope.$apply(function() {
                                    modelSetter(scope, element[0].files[0]);
                                });
                        });
                }
            };
        };

        return ['$parse', FileModel];
    });

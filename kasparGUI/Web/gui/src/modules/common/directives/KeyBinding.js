'use strict';

define(function(require) {
        var angular = require('angular');
        var Mousetrap = require('mousetrap');

        var KeyBinding = function($timeout) {
            return {
                restrict: 'E',
                scope: {
                    invoke: '&'
                },
                link: function(scope, element, attrs, controller) {
                    if (attrs.button) {
                        Mousetrap.bind(attrs.on, function() {
                                scope.invoke();
                                var elem = angular.element(element).parent().find(attrs.button);
                                if (elem) {
                                    elem.addClass('active');
                                    $timeout(elem.removeClass('active'), 2000);
                                }
                            });
                    } else {
                        Mousetrap.bind(attrs.on, scope.invoke);
                    }
                },
                controller: function($scope) {},
            };
        };

        return ['$timeout', KeyBinding];
    });

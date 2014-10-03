'use strict';

define(function(require) {
        var angular = require('angular');
        var $ = require('jquery');

        var Dropdown = function($compile) {
            return {
                restrict: 'E',
                scope: {
                    items: '=ddOptions',
                    selectedItem: '=ddModel'
                },
                link: function(scope, element, attrs) {
                    var html = '';
                    switch (attrs.menuType) {
                        case "select":
                            html += '<div class="btn-group"><button class="btn btn-default button-label dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>';
                            break;
                        case "button":
                            html += '<div class="btn-group"><button class="btn button-label btn-default"></button><button class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>';
                            break;
                        default:
                            html += '<div class="dropdown"><a class="dropdown-toggle" role="button" data-toggle="dropdown" href="javascript:;">Dropdown<b class="caret"></b></a>';
                            break;
                    }
                    html += '<ul class="dropdown-menu"><li ng-repeat="item in items | orderBy:&apos;name&apos;"><a tabindex="-1" data-ng-click="selectVal(item)">{{item.name}}</a></li></ul></div>';
                    element.append($compile(html)(scope));
                    for (var i = 0; i < scope.items.length; i++) {
                        if (scope.items[i].id === scope.selectedItem) {
                            scope.bSelectedItem = scope.items[i];
                            break;
                        }
                    }
                    scope.selectVal = function(item) {
                        var label = '';
                        if (item) {
                            label = item.name;
                        } else {
                            label = attrs.prompt;
                        }
                        switch (attrs.menuType) {
                            case "select":
                                $('button.button-label', element).html(label + ' <span class="caret"></span>');
                                break;
                            case "button":
                                $('button.button-label', element).html(label);
                                break;
                            default:
                                $('a.dropdown-toggle', element).html('<b class="caret"></b> ' + label);
                                break;
                        }
                        scope.selectedItem = item;
                    };
                    scope.selectVal(scope.bSelectedItem);
                }
            };
        };

        return ['$compile', Dropdown];

    });

'use strict';

define(function(require) {
        var angular = require('angular');
        var angularRouter = require('angularUIRouter');
        var angularBootstrap = require('angularBoostrap');
        var angularLoadingBar = require('angularLoadingBar');
        var modelServices = require('common/services/modelServices');

        var defaultTemplate = require('text!teacher/index.tpl.html');
        var teacher = require('categories/teacher');
        var commonControllers = require('common/controllers');

        var moduleName = 'kasparGUI';
        var dependancies = [
            angularRouter,
            angularBootstrap,
            angularLoadingBar,
            commonControllers,
            teacher,
        ];

        var Routes = function($stateProvider, $urlRouterProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise("/teacher.html");
            $stateProvider.state('default', {
                    url: '/teacher.html',
                    template: defaultTemplate,
                    controller: ['$scope', 'loginService',
                        function($scope, loginService) {
                            $scope.loginService = loginService;
                        }
                    ],
                });
        };

        var ApiConfig = function(modelBuilderProvider) {
            modelBuilderProvider.setBasePath('/api');
        };

        var LoadingBarConfig = function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
        };

        var module = angular.module(moduleName, dependancies);
        module.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', Routes]);
        module.config(['modelBuilderProvider', ApiConfig]);
        module.config(['cfpLoadingBarProvider', LoadingBarConfig]);
        return moduleName;
    });

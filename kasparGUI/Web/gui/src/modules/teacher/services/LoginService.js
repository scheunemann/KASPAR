'use strict';

define(function(require) {
        var angular = require('angular');

        var LoginService = function(Operator) {
            this.login = function(userName, pass) {
                this.loggedIn = true;
                this.operator = {'name': userName};
            };

            this.logout = function() {
                this.loggedIn = false;
                this.operator = null;
            };

            this.loggedIn = true;
            this.operator = {'name': 'Teacher'};
        };

        return ['Operator', LoginService];
    });

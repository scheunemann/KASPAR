'use strict';

define(function(require) {
	var angular = require('angular');

	var UserService = function(User) {
		this.getUsers = function() {
			return User.query();
		}
	}

	return UserService;
});

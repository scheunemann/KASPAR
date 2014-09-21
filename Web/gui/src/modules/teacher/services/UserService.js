'use strict';

define(function(require) {
	var angular = require('angular');

	var UserService = function(User) {
		return User.query();
	}

	return UserService;
});

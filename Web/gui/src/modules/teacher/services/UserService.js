'use strict';

define(function(require) {
	var angular = require('angular');

	var UserService = function() {
		this.getUsers = function() {
			return [ {
				name : 'John Smith',
				birthday : '5/7/2008',
				gender : 'M',
				thumbsrc: 'boy_thumb.png',
				fullsrc: 'boy.png',
			}, {
				name : 'Jill Smith',
				birthday : '5/7/2008',
				gender : 'F',
				thumbsrc: 'girl_thumb.png',
				fullsrc: 'girl.png',
			}, {
				name : 'Jane Smith',
				birthday : '5/7/2008',
				gender : 'F',
				thumbsrc: 'girl_thumb.png',
				fullsrc: 'girl.png',
			}, {
				name : 'Jimmy Smith',
				birthday : '5/7/2008',
				gender : 'M',
				thumbsrc: 'boy_thumb.png',
				fullsrc: 'boy.png',
			} ];
		}
	};

	return UserService;
});

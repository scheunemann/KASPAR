'use strict';

define(function(require) {
	var angular = require('angular');

	var UserService = function() {
		this.getUsers = function() {
			return [ {
				name : 'John Smith',
				birthday : '5/7/2008',
				gender : 'M',
				thumbsrc : 'user_thumb.png',
				fullsrc : 'user.png',
				objectives : [ {
					title : 'Turn Taking',
					key : 'turntaking',
				}, {
					title : 'Interaction',
					key : 'interaction',
				}, ]
			}, {
				name : 'Jill Smith',
				birthday : '5/7/2008',
				gender : 'F',
				thumbsrc : 'user_thumb.png',
				fullsrc : 'user.png',
				objectives : [ {
					title : 'Other',
					key : 'other',
				}, ]
			}, {
				name : 'Jane Smith',
				birthday : '5/7/2008',
				gender : 'F',
				thumbsrc : 'user_thumb.png',
				fullsrc : 'user.png',
				objectives : [ {
					title : 'Interaction',
					key : 'interaction',
				}, ]
			}, {
				name : 'Jimmy Smith',
				birthday : '5/7/2008',
				gender : 'M',
				thumbsrc : 'user_thumb.png',
				fullsrc : 'user.png',
				objectives : []
			} ];
		}
	};

	return UserService;
});

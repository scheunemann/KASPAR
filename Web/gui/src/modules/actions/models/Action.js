'use strict';

define(function(require) {
	var Action = function(modelBuilder) {
		var resource = modelBuilder.getModel('Action', {}, {
			create : {
				method : 'POST',
				url : ':type',
				params : {
					type : '@type'
				},
				isArray : false,
			},
			update : {
				method : 'PUT',
				url : ':type/:id',
				params : {
					type : '@type',
					id : '@id',
				},
				isArray : false,
			},
		});

		return resource;
	};

	return [ 'modelBuilder', Action ];
});

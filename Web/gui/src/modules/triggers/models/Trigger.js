'use strict';

define(function(require) {
	var Trigger = function($rootScope, modelBuilder) {
		var resource = modelBuilder.getModel('Trigger', {}, {
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

	return [ '$rootScope', 'modelBuilder', Trigger ];
});

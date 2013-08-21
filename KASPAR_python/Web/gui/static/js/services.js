'use strict';

angular.module('proxyService', [ 'ngResource'])
	.service('objectProxy', ['$resource', function($resource)
      {
		this.resolve = function(item) {
			if(item != undefined && item.hasOwnProperty('proxyObject')) {
				var Obj = $resource(item.uri, {id:'@id'});
				if (item.isList) {
					var result = [];
					for (var id in item.ids) {
						Obj.get({id:item.ids[id]}, function(o) {
							result.push(o);
						});
					}
					
					return result;
				} else {
					return Obj.get({id:item.ids[id]});
				}
			} else {
				return item;
			}
		};
    }])
;

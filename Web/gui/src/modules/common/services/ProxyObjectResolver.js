'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');
	require('./ObjectCache'); 

	var ProxyObjectResolver = function($q, $timeout, $rootScope, objectCache) {
		var getObj = function(metaData, id) {
			if (id !== undefined) {
				var key = metaData.data.uri.replace(':id', id.toString());
				if (!objectCache.hasObj(key)) {
					var obj = metaData.resource.get({
						id : id
					}).$promise;
					obj.then(function(o) {
						objectCache.setObj(key, o);
					});

					return obj;
				}

				return objectCache.getObj(key);
			} else {
				return null;
			}
		}

		this.resolveProp = function(object, propName, callback) {
			if (object != undefined) {
				if (object[propName + '_metaData'] != undefined && object[propName + '_metaData'].resolved == false) {
					var metaData = object[propName + '_metaData'];
					var obj = object;
					var result;
					if (metaData.data.isList) {
						var objs = [];
						for (var index = 0; index < metaData.data.ids.length; index++) {
							var id = metaData.data.ids[index];
							objs.push(getObj(metaData, id));
						}

						result = $q.all(objs);
					} else {
						var id = metaData.data.ids[0];
						result = $q.when(getObj(metaData, id));
					}

					result.then(function(vars) {
						metaData.resolved = true;
						if (metaData.data.isList) {
							for (var index = 0; index < vars.length; index++) {
								obj[propName].push(vars[index]);
							}
						} else {
							angular.extend(obj[propName], vars);
						}
						$rootScope.$$phase || $rootScope.$digest();
						if (callback != undefined) {
							callback(vars);
						}
					});
				} else {
					if (callback != undefined) {
						callback(object[propName]);
					}
				}
			}
		}
	};

	return [ '$q', '$timeout', '$rootScope', 'objectCache', ProxyObjectResolver ];
});

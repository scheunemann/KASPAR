'use strict';

angular.module('proxyService', [ 'ngResource' ])
	.service('objectCache', ['$q', '$timeout', function($q, $timeout) {
		var objCache = {}; //Don't know if this is a good idea since it'll prevent GC, but we'll see I guess...
		
    	this.getObj = function(key) {
			if(objCache[key] != undefined) {
				return objCache[key].obj;
			} else {
				return null;
			}
    	};
    	
    	this.setObj = function(key, obj) {
    		objCache[key] = {obj:obj, info:{}};
    	};
    	
    	this.hasObj = function(key) {
    		return objCache.hasOwnProperty(key);
    	};
	}])
	.service('proxyObjectResolver', ['$q', '$timeout', 'objectCache', function($q, $timeout, objectCache) {
    	var getObj = function(metaData, id) {
			var key = metaData.uri.replace(':id', id.toString());
			if(!objectCache.hasObj(key)) {
				var obj = metaData.resource.get({ id: id }).$promise;
				obj.then(function(o) {
					objectCache.setObj(key, o);
				});
				
				return obj;
			}
			
			return objectCache.getObj(key);
    	}
		
    	this.resolveProp = function(object, propName) {
			if(object != undefined) { 
				if(object[propName + '_metaData'] != undefined && object[propName + '_metaData'].resolved==false) {
					var metaData = object[propName + '_metaData'];
					metaData.resolved = null;
					if(metaData.isList) {
						var objs = [];
						for(var index = 0; index < metaData.ids.length; index++) {
							var id = metaData.ids[index];
							objs.push(getObj(metaData, id));
						}
						
						$q.all(objs).then(function(vars) {
							metaData.defer.resolve(vars);
							metaData.resolved = true;
						});
					} else {
						var id = metaData.ids[0];
						getObj(metaData, id).then(function(vars) {
							metaData.defer.resolve(vars);
							metaData.resolved = true;
						});
					}
				}
			}
    	}
	}])
    .factory('proxyResourceInterceptor', ['$injector', '$q', 'proxyObjectResolver', 'objectCache', function($injector, $q, proxyObjectResolver, objectCache) {
    	var modObject = function(respObj) {
			for(var prop in respObj) {
				if (respObj[prop] != undefined && respObj[prop].hasOwnProperty('proxyObject') && $injector.has(respObj[prop].type)) {
					respObj[prop + '_metaData'] = respObj[prop];
					respObj[prop + '_metaData']['defer'] = $q.defer();
					respObj[prop + '_metaData']['resolved'] = false;
					respObj[prop + '_metaData']['resource'] = $injector.get(respObj[prop].type);
					respObj[prop] = respObj[prop + '_metaData'].defer.promise;
				}
			}
    	};
    	
    	return {
    		'response': function(response) {
    			if (response != undefined && typeof response.data != "string") {
    				if(response.config.url.substring(0, 5) == '/api/') {
	    				if(angular.isArray(response.data)) {
	    					for(var i = 0; i < response.data.length; i++) {
	    						if(response.data[i].hasOwnProperty('id')) {
		    						var key = response.config.url + '/' + response.data[i].id;
		    						if(objectCache.hasObj(key)) {
		    							response.data[i] = objectCache.getObj(key);
		    						} else {
		    							modObject(response.data[i]);
		    							objectCache.setObj(key, response.data[i]);
		    						}
	    						}
							}
						} else {
    						if(response.data.hasOwnProperty('id')) {
	    						var key = response.config.url;
	    						if(objectCache.hasObj(key)) {
	    							response.data = objectCache.getObj(key);
	    						} else {
	    							modObject(response.data);
	    							objectCache.setObj(key, response.data);
	    						}
    						}
						}
    				}
				}
    			
    			return response;
    		}
    	}
    }])
;

'use strict';

angular.module('proxyService', [ 'ngResource' ])
	.service('objectCache', ['$q', '$timeout', function($q, $timeout) {
		var objCache = {}; //Don't know if this is a good idea since it'll prevent GC, but we'll see I guess...
		
		// Can't remember why I wanted to cache objects, disabling for now
		var cache = false;
		
    	this.getObj = function(key) {
    		if (cache) {
				if(objCache[key] != undefined) {
					return objCache[key].obj;
				} else {
					return null;
				}
    		} else {
    			return null;
    		}    		
    	};
    	
    	this.setObj = function(key, obj) {
    		if (cache) {
    			objCache[key] = {obj:obj, info:{}};
    		}
    	};
    	
    	this.hasObj = function(key) {
    		if (cache) {
    			return objCache.hasOwnProperty(key);	
    		} else {
    			return false;
    		}
    	};
    	
    	this.removeObj = function(key) {
    		if (cache) {
    			delete objCache[key];
    		}
    	}
	}])
	.service('proxyObjectResolver', ['$q', '$timeout', '$rootScope', 'objectCache', function($q, $timeout, $rootScope, objectCache) {
    	var getObj = function(metaData, id) {
			var key = metaData.data.uri.replace(':id', id.toString());
			if(!objectCache.hasObj(key)) {
				var obj = metaData.resource.get({ id: id }).$promise;
				obj.then(function(o) {
					objectCache.setObj(key, o);
				});
				
				return obj;
			}
			
			return objectCache.getObj(key);
    	}
		
    	this.resolveProp = function(object, propName, callback) {
			if(object != undefined) { 
				if(object[propName + '_metaData'] != undefined && object[propName + '_metaData'].resolved==false) {
					var metaData = object[propName + '_metaData'];
					metaData.resolved = null;
					var result;
					if(metaData.data.isList) {
						var objs = [];
						for(var index = 0; index < metaData.data.ids.length; index++) {
							var id = metaData.data.ids[index];
							objs.push(getObj(metaData, id));
						}
						
						result = $q.all(objs);
					} else {
						var id = metaData.data.ids[0];
						result = $q.when(getObj(metaData, id));
					}
					
					result.then(function(vars) {
						metaData.defer.resolve(vars);
						metaData.resolved = true;
						if(!$rootScope.$$phase) {
							$rootScope.$apply();
						}
						if (callback != undefined) {
							callback(vars);
						}
					});
				} else {
					if(!$rootScope.$$phase) {
						$rootScope.$apply();
					}
					if (callback != undefined) {
						$q.when(object[propName]).then(function(val) {
							callback(val);
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
					respObj[prop + '_metaData'] = {};
					respObj[prop + '_metaData']['data'] = respObj[prop];
					respObj[prop + '_metaData']['defer'] = $q.defer();
					respObj[prop + '_metaData']['resolved'] = false;
					respObj[prop + '_metaData']['resource'] = $injector.get(respObj[prop].type);
					respObj[prop] = respObj[prop + '_metaData'].defer.promise;
				}
			}
    	};
    	
    	var unModObject = function(reqObj) {
			for(var prop in reqObj) {
				if (reqObj[prop] != undefined && reqObj[prop + '_metaData'] != undefined) {
					if (!reqObj[prop + '_metaData']['resolved']) {
						reqObj[prop] = reqObj[prop + '_metaData']['data'];
					} else {
						reqObj[prop] = reqObj[prop].$$v;
					}
					
					delete reqObj[prop + '_metaData'];
				}
			}
    	}
    	
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
    		},
    		'request': function(request) {
    			if (request.method == "POST") {
    				unModObject(request.data);
        			var key = request.url;
        			objectCache.removeObj(key);
    			}
    			
    			
    			return request;
    		}
    	}
    }])
;

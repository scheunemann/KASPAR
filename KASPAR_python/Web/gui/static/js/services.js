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
    		var hit = objCache.hasOwnProperty(key);
    		if(hit) {
    			console.log('cache hit: ' + key);
    		}
    		return hit;
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
    		return this.getFunc(object, propName)();
    	}
    	
    	this.getFunc = function(object, propName) {
			return function() {
				if(object != undefined) { 
					if(object[propName] === undefined && object[propName + '_metaData'] != undefined) {
						var metaData = object[propName + '_metaData'];
						if(metaData.isList) {
							var objs = [];
							for(var index = 0; index < metaData.ids.length; index++) {
								var id = metaData.ids[index];
								objs.push(getObj(metaData, id));
							}
											
							object[propName] = $q.all(objs).then(function(vars) {
								return vars;
							});
						} else {
							var id = metaData.ids[0];
							object[propName] = getObj(metaData, id);
						}
					}

					return object[propName];
				}
			};
    	}
    	
    	this.setFunc = function(object, propName) {
    		return function() {
    			object[propName] = val;
    		}
    	}
	}])
    .factory('proxyResourceInterceptor', ['$injector', '$q', 'proxyObjectResolver', 'objectCache', function($injector, $q, proxyObjectResolver, objectCache) {
    	var modObject = function(respObj) {
			for(var prop in respObj) {
				if (respObj[prop] != undefined && respObj[prop].hasOwnProperty('proxyObject') && $injector.has(respObj[prop].type)) {
					respObj[prop + '_metaData'] = respObj[prop];
					respObj[prop + '_metaData']['resource'] = $injector.get(respObj[prop].type);
					
					delete respObj[prop];
					//respObj.__defineGetter__(prop, getFunc(respObj, prop));							
					respObj.__defineSetter__(prop, proxyObjectResolver.setFunc(respObj, prop));
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
		    							response.data[i] = $q.when(objectCache.getObj(key));
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
	    							response.data = $q.when(objectCache.getObj(key));
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

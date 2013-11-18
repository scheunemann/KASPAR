'use strict';

angular.module('displayService', [])
	.service('hotkeyFormatter', [function() {
		this.getDisplay = function(hotKey) {
			var key = "";
			if (hotKey.modifiers != null) {
				if (hotKey.modifiers.indexOf('alt') >= 0) {
					key += " + alt";
				}
	
				if (hotKey.modifiers.indexOf('ctrl') >= 0) {
					key += " + ctrl";
				}
	
				if (hotKey.modifiers.indexOf('shift') >= 0) {
					key += " + shift";
				}
			}
	
			var disp = this.getCharDisplay(hotKey.keyCode);
			if (disp != "" || key != "") {
				if (disp != "") {
					key += " + " + disp;
				}
	
				return key.slice(3);
			} else {
				return "";
			}
		}
	
		this.getCharDisplay = function(charCode) {
			// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
			var char;
			if (charCode == 8)
				char = "backspace";
			else if (charCode == 9)
				char = ""; // tab
			else if (charCode == 13)
				char = "enter";
			else if (charCode == 16)
				char = ""; // shift
			else if (charCode == 17)
				char = ""; // ctrl
			else if (charCode == 18)
				char = ""; // alt
			else if (charCode == 19)
				char = "pause/break";
			else if (charCode == 20)
				char = ""; // caps
			else if (charCode == 27)
				char = "escape";
			else if (charCode == 32)
				char = "space";
			else if (charCode == 33)
				char = "pageUp";
			else if (charCode == 34)
				char = "pageDown";
			else if (charCode == 35)
				char = "end";
			else if (charCode == 36)
				char = "home";
			else if (charCode == 37)
				char = "left";
			else if (charCode == 38)
				char = "up";
			else if (charCode == 39)
				char = "right";
			else if (charCode == 40)
				char = "down";
			else if (charCode == 45)
				char = "insert";
			else if (charCode == 46)
				char = "delete";
			else if (charCode == 91)
				char = ""; // left win
			else if (charCode == 92)
				char = ""; // right win
			else if (charCode == 93)
				char = ""; // select
			else if (charCode == 96)
				char = "num0";
			else if (charCode == 97)
				char = "num1";
			else if (charCode == 98)
				char = "num2";
			else if (charCode == 99)
				char = "num3";
			else if (charCode == 100)
				char = "num4";
			else if (charCode == 101)
				char = "num5";
			else if (charCode == 102)
				char = "num6";
			else if (charCode == 103)
				char = "num7";
			else if (charCode == 104)
				char = "num8";
			else if (charCode == 105)
				char = "num9";
			else if (charCode == 106)
				char = "num*";
			else if (charCode == 107)
				char = "num+";
			else if (charCode == 109)
				char = "num-";
			else if (charCode == 110)
				char = "num.";
			else if (charCode == 111)
				char = "num/";
			else if (charCode == 112)
				char = "F1";
			else if (charCode == 113)
				char = "F2";
			else if (charCode == 114)
				char = "F3";
			else if (charCode == 115)
				char = "F4";
			else if (charCode == 116)
				char = "F5";
			else if (charCode == 117)
				char = "F6";
			else if (charCode == 118)
				char = "F7";
			else if (charCode == 119)
				char = "F8";
			else if (charCode == 120)
				char = "F9";
			else if (charCode == 121)
				char = "F10";
			else if (charCode == 122)
				char = "F11";
			else if (charCode == 123)
				char = "F12";
			else if (charCode == 144)
				char = ""; // num lock
			else if (charCode == 145)
				char = ""; // scroll lock
			else if (charCode == 186)
				char = ";";
			else if (charCode == 187)
				char = "=";
			else if (charCode == 188)
				char = ",";
			else if (charCode == 189)
				char = "-";
			else if (charCode == 190)
				char = ".";
			else if (charCode == 191)
				char = "/";
			else if (charCode == 192)
				char = "`";
			else if (charCode == 219)
				char = "[";
			else if (charCode == 220)
				char = "\\";
			else if (charCode == 221)
				char = "]";
			else if (charCode == 222)
				char = "'";
			else
				char = String.fromCharCode(charCode);
			return char;
		}
	}]);

angular.module('proxyService', [ 'ngResource' ]).service('objectCache', [ '$q', '$timeout', function($q, $timeout) {
	var objCache = {}; // Don't know if this is a good idea since it'll prevent
						// GC, but we'll see I guess...

	// Can't remember why I wanted to cache objects, disabling for now
	var cache = false;

	this.getObj = function(key) {
		if (cache) {
			if (objCache[key] != undefined) {
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
			objCache[key] = {
				obj : obj,
				info : {}
			};
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
} ]).service('proxyObjectResolver', [ '$q', '$timeout', '$rootScope', 'objectCache', function($q, $timeout, $rootScope, objectCache) {
	var getObj = function(metaData, id) {
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
	}

	this.resolveProp = function(object, propName, callback) {
		if (object != undefined) {
			if (object[propName + '_metaData'] != undefined && object[propName + '_metaData'].resolved == false) {
				var metaData = object[propName + '_metaData'];
				metaData.resolved = null;
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
					metaData.defer.resolve(vars);
					metaData.resolved = true;
					if (!$rootScope.$$phase) {
						$rootScope.$apply();
					}
					if (callback != undefined) {
						callback(vars);
					}
				});
			} else {
				if (!$rootScope.$$phase) {
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
} ]).factory('proxyResourceInterceptor', [ '$injector', '$q', 'proxyObjectResolver', 'objectCache', function($injector, $q, proxyObjectResolver, objectCache) {
	var modObject = function(respObj) {
		for ( var prop in respObj) {
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
		for ( var prop in reqObj) {
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
		'response' : function(response) {
			if (response != undefined && typeof response.data != "string") {
				if (response.config.url.substring(0, 5) == '/api/') {
					if (angular.isArray(response.data)) {
						for (var i = 0; i < response.data.length; i++) {
							if (response.data[i].hasOwnProperty('id')) {
								var key = response.config.url + '/' + response.data[i].id;
								if (objectCache.hasObj(key)) {
									response.data[i] = objectCache.getObj(key);
								} else {
									modObject(response.data[i]);
									objectCache.setObj(key, response.data[i]);
								}
							}
						}
					} else {
						if (response.data.hasOwnProperty('id')) {
							var key = response.config.url;
							if (objectCache.hasObj(key)) {
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
		'request' : function(request) {
			if (request.method == "POST") {
				unModObject(request.data);
				var key = request.url;
				objectCache.removeObj(key);
			}

			return request;
		}
	}
} ]);

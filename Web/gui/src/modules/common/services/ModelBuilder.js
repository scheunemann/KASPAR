'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var ModelBuilder = function() {
		this.basePath = "";

		this.setBasePath = function(path) {
			if (path.indexOf('/', path.length - 1) == -1) {
				path = path + '/';
			}

			this.basePath = path;
		};

		this.transformResponse = function(data, headersGetter) {
			data = angular.fromJson(data);
			var headers = headersGetter();
			var newResponse = data.objects;

			newResponse.paging = {
				num_results : data.num_results,
				page : data.page,
				total_pages : data.total_pages
			};

			return newResponse;
		};

		this.$get = [ '$resource', '$q', '$rootScope', function($resource, $q, $rootScope) {
			var root = this;
			var getModel = function(model, params, methods, url) {
				if (url === undefined) {
					url = root.basePath + model + '/:id';
				} else {
					url = root.basePath + url;
				}

				var defaultMethods = {
					update : {
						method : 'PUT',
						isArray : false,
					},
					create : {
						method : 'POST',
					},
					get : {
						method : 'GET',
						cache: true,
					},
					query : {
						method : 'GET',
						isArray : true,
						cache: false,
						transformResponse : root.transformResponse,
					},
				};

				var defaultParams = {
					id : '@id',
				};

				methods = angular.extend(defaultMethods, methods);
				for ( var name in methods) {
					if (methods[name].hasOwnProperty('url')) {
						methods[name].url = root.basePath + methods[name].url;
					}
				}

				params = angular.extend(defaultParams, params);
				var resource = $resource(url, params, methods);

				resource.prototype.getProperty = function(propName) {
					var key = '$__' + propName;
					if(this[key] === undefined) {
						var subUrl = root.basePath + model + '/' + this.id + '/' + propName;
						this[key] = $resource(subUrl, {}, defaultMethods).query();
					}
					
					return this[key];
				};

				resource.prototype.getConcreteClassInstance = function() {
					if (this.$concreteResolved) { return this; }
					if (this.id === undefined || this.type === undefined) {
						if (this.$promise !== undefined) {
							return this;
						} else {
							var def = $q.defer();
							this.$promise = def.promise;
							def.resolve(this);
							return this;
						}
					}

					var concreteModel = getModel(this.type);
					var concreteInstance = concreteModel.get({
						id : this.id
					});

					concreteInstance.$promise.then(function(res) {
						res.$concreteResolved = true;
					});

					return concreteInstance;
				};

				resource.prototype.$save = function() {
					if (!this.id) {
						return this.$create();
					} else {
						return this.$update();
					}
				};

				resource.queryBase = resource.query;
				resource.query = function(params) {
					if (params !== undefined) {
						var q = {};
						q.filters = [];
						for ( var key in params) {
							q.filters.push({
								name : key,
								op : params[key] === null ? 'is_null' : '==',
								val : params[key],
							});
						}
						return this.queryBase({
							q : q
						});
					} else {
						return this.queryBase();
					}
				};

				return resource;
			};

			return {
				getModel : getModel,
			};
		} ];
	};

	return ModelBuilder;
});

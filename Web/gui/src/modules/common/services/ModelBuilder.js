'use strict';

define(function(require) {
	var angular = require('angular')
	require('angularResource');

	var ModelBuilder = function() {
		this.basePath = "";

		this.setBasePath = function(path) {
			if (path.indexOf('/', path.length - 1) == -1) {
				path = path + '/';
			}

			this.basePath = path;
		}

		this.transformResponse = function(data, headersGetter) {
			data = angular.fromJson(data);
			var newResponse = data.objects;
			newResponse.paging = {
				num_results : data.num_results,
				page : data.page,
				total_pages : data.total_pages
			}

			return newResponse;
		}

		this.$get = [ '$resource', function($resource) {
			var basePath = this.basePath;
			var transformResponse = this.transformResponse;
			return {
				getModel : function(model, params, methods) {
					var url = basePath + model + '/:id';

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
						},
						query : {
							method : 'GET',
							isArray : true,
							transformResponse : transformResponse,
						},
					};

					var defaultParams = {
						id : '@id',
					}

					methods = angular.extend(defaultMethods, methods);
					params = angular.extend(defaultParams, params);
					var resource = $resource(url, params, methods);

					resource.prototype.getProperty = function(propName) {
						var subUrl = basePath + model + '/' + this.id + '/' + propName;
						return $resource(subUrl, {}, defaultMethods).query();
					}

					resource.prototype.$save = function() {
						if (!this.id) {
							return this.$create();
						} else {
							return this.$update();
						}
					};

					return resource;
				},
			};
		} ];
	};

	return ModelBuilder;
});
'use strict';

define(function(require) {
	var angular = require('angular');

	var Model = function(modelBuilder) {
		return {
			restrict : 'A',
			require : 'form',
			link : function(scope, element, attrs, controller) {
				scope.formCtrl = controller;
				attrs.$observe('model', function(modelName) {
					scope.$watch(modelName, function(modelInstance) {
						scope.model = modelInstance;
					});
				});
			},
			controller : function($scope) {
				this.updateObj = function(modelCtrl) {
					if ($scope.formCtrl.$valid) {
						if ($scope.model.$save === undefined) {
							if ($scope.model._link != undefined) {
								var Model = modelBuilder.getModel($scope.model._link.model);
								$scope.model = new Model($scope.model);
							} else {
								//TODO: Error handling
								return;
							}
						}
						
						$scope.model.$save().then(function() {
							modelCtrl.$setPristine();
						});
					}
				};

				this.newObj = function(type) {
					var newO = new type();
					if (list != undefined) {
						list.push(newO);
					}
					return newO;
				};

				this.deleteObj = function() {
					return item.$delete(function() {
						var select = null;
						if (list != undefined) {
							list.splice(list.indexOf(item), 1);
							if (list.length > 0) {
								select = list[0];
							}
						}

						return select;
					});
				};
			}
		};
	};

	return [ 'modelBuilder', Model ];
});

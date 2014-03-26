(function() {
	'use strict';

	var dependancies = [ 'angular' ];

	define(dependancies, function(angular) {

		var Model = function() {
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
							$scope.model.$save(function() {
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

		return Model;
	});
}());

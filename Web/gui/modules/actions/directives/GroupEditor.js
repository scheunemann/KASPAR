(function() {
	'use strict';

	var dependancies = [ 
	                     'angular', 
	                     'text!./groupEditor.tpl.html',
	                     'common/services/proxyServices'
	                     ];

	define(dependancies, function(angular, template, proxyServices) {

		var GroupEditor = function(proxyObjectResolver) {
			return {
				template : template,
				restrict : 'E',
				scope : {
					group : "=action",
					actions : "=",
				},
				controller : function($scope) {
					$scope.$watch('group', function(group) {
						proxyObjectResolver.resolveProp(group, 'actions');
					});

					$scope.addActions = function(actions) {
						if ($scope.group.actions === undefined) {
							$scope.group.actions = [];
						}

						for (var i = 0; i < actions.length; i++) {
							$scope.group.actions.push(actions[i]);
						}

						$scope.group.$save();
					};

					$scope.removeActions = function(actions) {
						for (var i = 0; i < actions.length; i++) {
							$scope.group.actions.splice($scope.group.actions.indexOf(actions[i]), 1);
						}

						$scope.group.$save();
					};
				},
			};
		};

		return [ 'proxyObjectResolver', GroupEditor ];
	});
}());

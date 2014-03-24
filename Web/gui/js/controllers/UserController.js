(function() {
	'use strict';

	var dependancies = [ 
	                     'angular',
	                     'js/services/proxyServices',
	                     'js/models/User',
	                     'js/models/CustomAction',
	                     'js/models/CustomTrigger',
	                     'js/models/Action',
	                     'js/models/Trigger'
	                     ];
	
	define(dependancies, function(angular, proxyServices, User, CustomAction, CustomTrigger, Action, Trigger) {
		'use strict';

		var UserController = function($scope, $filter, User, CustomAction, CustomTrigger, Action, Trigger, proxyObjectResolver) {
			$scope.users = User.query(function() {
				$scope.selectedUser = $scope.users[0];
			});

			$scope.$watch('selectedUser', function() {
				proxyObjectResolver.resolveProp($scope.selectedUser, 'customActions');
				proxyObjectResolver.resolveProp($scope.selectedUser, 'customTriggers');
			});
		};

		return [ '$scope', '$filter', 'User', 'CustomAction', 'CustomTrigger', 'Action', 'Trigger', 'proxyObjectResolver', UserController ];

	});
}());

(function() {
	'use strict';

	var dependancies = [ 
	                     'angular',
	                     'modules/common/services/proxyServices',
	                     'modules/actions/models',
	                     'modules/triggers/models',
	                     'modules/users/models',
	                     ];
	
	define(dependancies, function(
			angular, 
			proxyServices, 
			actionModels, 
			triggerModels, 
			userModels) {
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
